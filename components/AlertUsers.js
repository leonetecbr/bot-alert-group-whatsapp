const ALERTS = require('../alerts.json')
const database = require('../databases/db')
const User = require('../models/User')

async function AlertUsers(message, alertId, client){
    await database.sync()
    let where = {}
    where['a'+alertId] = true

    let users = await User.findAll(where)

    if (users !== null){
        let text = 'Oi, você tem um novo alerta para *' + ALERTS[alertId] + '*\n\n*' + message.notifyName + '* mandou a seguinte mensagem: \n\n'
        text += message.text
        for (let i = 0; typeof users[i] !== "undefined"; i++){
            await client.sendText(users[i].id, text)
        }
    }
}

module.exports = AlertUsers