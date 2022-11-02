const User = require('../models/User')
const Alert = require('../models/Alert')
const AlertUser = require('../models/AlertUser')

async function AlertUsers(found, client) {
    await User.sync()

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

    // Exclui usuários que não estão no grupo
    activeUsers = activeUsers.filter(user => members.includes(user))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (activeUsers.length === 0) return false

    // Monta o texto da mensagem
    activeUsers.map(id => text += '@' + id.split('@')[0] + ' ')

    // Envia a resposta para o grupo com as menções
    await client.sendReplyWithMentions(message.chatId, text, message.id)
}

module.exports = AlertUsers