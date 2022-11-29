import User from '../models/User.js'
import Alert from '../models/Alert.js'
import AlertUser from '../models/AlertUser.js'
import Alerted from '../models/Alerted.js'

export async function AlertUsers(found, client) {
    // Inicia o "digitando ..."
    await client.simulateTyping(found.message.chatId, true)
    await User.sync()

    console.log('_____________________________________________________________________________________________________')
    console.log('Texto da mensagem: ', found.message.text)
    console.log('Alertas encontrados: ', found.alerts)

    let alertsId, alerts, activeUsers = [], text = ''
    const message = found.message
    const members = await client.getGroupMembersId(message.chatId)

    // Se tiver encontrado apenas um alerta
    if (found.alerts.length === 1) {
        alertsId = found.alerts[0]
        alerts = await Alert.findByPk(alertsId, {
            include: {
                model: AlertUser,
                attributes: ['UserId']
            }
        })

        alerts.AlertUsers.map(alert => activeUsers.push(alert.UserId))
    }
    // Se tiver encontrado mais de um alerta
    else {
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

    // Exclui usuários que não estão no grupo e o autor da(s) mensagem(ns)
    activeUsers = activeUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (activeUsers.length === 0) {
        // Para o "digitando ..."
        await client.simulateTyping(found.message.chatId, false)
        return false
    }

    console.log('Membros com o(s) alerta(s) ativo(s): ', activeUsers)

    // Monta o texto da mensagem
    activeUsers.map(id => text += '@' + id.split('@')[0] + ' ')

    // Envia a resposta para o grupo com as menções
    let messageId = await client.sendReplyWithMentions(message.chatId, text, message.id, false, activeUsers)

    console.log('Texto enviado: ', text)

    // Se não tiver sido enviada com sucesso, tenta enviar novamente
    if (!messageId || !messageId.startsWith('true_')) messageId = await client.sendTextWithMentions(message.chatId, text, false, activeUsers)

    console.log('Id da mensagem: ', messageId)
    console.log('Id da mensagem respondida: ', message.id)

    // Para o "digitando ..."
    await client.simulateTyping(found.message.chatId, false)

    // Se tiver sido enviada com sucesso
    if (messageId && messageId.startsWith('true_')) {
        // Envia uma reação para a mensagem original
        await client.react(message.id, '✅')

        // Salva o ‘id’ da mensagem no banco de dados
        await Alerted.create({
            messageId,
            alertedMessageId: message.id
        })
    }
}

export default AlertUsers