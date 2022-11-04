const User = require('../models/User')
const Alert = require('../models/Alert')
const AlertUser = require('../models/AlertUser')
const Alerted = require('../models/Alerted')

async function AlertUsers(found, client) {
    await User.sync()

    console.log('_____________________________________________________________________________________________________')
    console.log('Texto da mensagem: ', found.message.text)
    console.log('Alertas encontrados: ', found.alerts)

    let alertsId, alerts, activeUsers = [], text = ''
    const message = found.message
    const members = await client.getGroupMembersId(message.chatId)

    if (found.alerts.length === 1) {
        alertsId = found.alerts[0]
        alerts = await Alert.findByPk(alertsId, {
            include: {
                model: AlertUser,
                attributes: ['UserId']
            }
        })

        alerts.AlertUsers.map(alert => activeUsers.push(alert.UserId))
    } else {
        alertsId = found.alerts

        alerts = await Alert.findAll({
            where: {
                id: alertsId
            },
            include: {
                model: AlertUser,
                attributes: ['UserId']
            }
        })

        alerts.map(alert => alert.AlertUsers.map(alert => activeUsers.push(alert.UserId)))
    }

    // Exclui os usuários repetidos
    activeUsers = [...new Set(activeUsers)]

    // Exclui usuários que não estão no grupo
    activeUsers = activeUsers.filter(user => members.includes(user))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (activeUsers.length === 0) return false

    console.log('Membros com o(s) alerta(s) ativo(s): ', activeUsers)

    // Monta o texto da mensagem
    activeUsers.map(id => text += '@' + id.split('@')[0] + ' ')

    // Envia a resposta para o grupo com as menções
    const messageId = await client.sendReplyWithMentions(message.chatId, text, message.id, false, activeUsers)

    console.log('Chat ID: ', message.chatId)
    console.log('Texto enviado: ', text)
    console.log('Id da mensagem: ', messageId)
    console.log('Id da mensagem respondida: ', message.id)

    // Se tiver sido enviada com sucesso
    if (messageId && messageId.startsWith('true_')) {
        // Salva o ‘id’ da mensagem no banco de dados
        await Alerted.create({
            messageId,
            alertedMessageId: message.id
        })
    }
}

module.exports = AlertUsers