const User = require('../models/User')
const Alert = require('../models/Alert')
const AlertUser = require('../models/AlertUser')

async function AlertUsers(found, client) {
    await User.sync()

    let alertsText, alertsId, alerts, activeUsers = [], alertsName = {}
    const message = found.message

    if (found.alerts.length === 1) {
        alertsId = found.alerts[0]
        alerts = await Alert.findByPk(alertsId, {
            include: {
                model: AlertUser,
                attributes: ['UserId']
            }
        })
        alertsText = '#' + alerts.name

        alerts.AlertUsers.map(alert => activeUsers.push(alert.UserId))
        alertsName[alerts.id] = alerts.name
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
        alerts.map(alert => alertsName[alert.id] = alert.name)

        alertsText = ''
        // Forma a string com a lista de alertas
        for (let i = 0; typeof alertsId[i] !== 'undefined'; i++) {
            if (i !== 0 && i + 1 === alertsId.length) alertsText += '* e *'

            alertsText += '#' + alertsName[alertsId[i]]

            if (i + 3 <= alertsId.length) alertsText += '*, *'
        }
    }

    // Se existirem usuários com o(a) alerta(s) ativado(s)
    if (activeUsers.length === 0) return false

    const text = 'Oi, você tem um novo alerta para *' + alertsText + '*\n\n*' + message.sender.pushname + '* mandou a' +
        ' seguinte mensagem no grupo *' + message.chat.name + '*:'

    activeUsers.map(async id => {
        if (id === message.author) return false

        await client.sendText(id, text)
        await client.ghostForward(id, message.id)
    })
}

module.exports = AlertUsers