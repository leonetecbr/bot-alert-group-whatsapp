const ALERTS = require('../resources/alerts.json')
const database = require('../databases/db')
const User = require('../models/User')
const {Op} = require('sequelize')

async function AlertUsers(found, client) {
    await database.sync()

    let where = {}, users, alertsText = '', attributes = ['id'], alertsId
    const message = found.message

    if (found.alerts.length === 1) {
        alertsId = found.alerts[0]
        alertsText = ALERTS[alertsId]
        where['a' + alertsId] = true
        attributes.push('a' + alertsId)
        users = await User.findAll({
            attributes: attributes,
            where: where,
            raw: true
        })
    } else {
        alertsId = found.alerts

        for (let i = 0; typeof alertsId[i] !== 'undefined'; i++) {
            where['a' + alertsId[i]] = true
            attributes.push('a' + alertsId[i])
        }

        users = await User.findAll({
            attributes: attributes,
            where: {
                [Op.or]: where
            },
            raw: true
        })
    }

    // Se existirem usuários com o(a) alerta(s) ativado(s)
    if (users.length === 0) return false
    let start, end

    start = 'Oi, você tem um novo alerta para *'
    end = '*\n\n*' + message.sender.pushname + '* mandou a seguinte mensagem no grupo *' + message.chat.name +
        '*:'

    for (let i = 0; i < users.length; i++) {
        // Se for o usuário que lançou o alerta, vai para o próximo o usuário
        if (users[i].id === message.author) continue

        // Se foram vários alertas lançados, busca quais esse usuário ativou
        if (typeof alertsId === 'object') {
            const alertId = alertsId.filter((value) => {
                return (users[i]['a' + value] === 1)
            })

            // Se o usuário ativou apenas um alerta
            if (alertId.length === 1) alertsText = ALERTS[alertId[0]]
            else {
                alertsText = ''
                // Forma a string com a lista de alertas
                for (let i = 0; typeof alertId[i] !== 'undefined'; i++) {
                    if (i !== 0 && i + 1 === alertId.length) alertsText += '* e *'

                    alertsText += ALERTS[alertId[i]]

                    if (i + 3 <= alertId.length) alertsText += '*, *'
                }
            }
        }

        // Cria o texto da mensagem
        let text = start + alertsText + end

        await client.sendText(users[i].id, text)
        await client.ghostForward(users[i].id, message.id)
    }
}

module.exports = AlertUsers