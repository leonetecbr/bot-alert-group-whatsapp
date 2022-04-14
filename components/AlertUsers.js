const ALERTS = require('../resources/alerts.json')
const database = require('../databases/db')
const User = require('../models/User')
const admin = require('../resources/admin.json')

async function AlertUsers(message, alertId, client){
    await database.sync()
    let where = {}
    where['a'+alertId] = true

    let users = await User.findAll(where)

    if (users !== null){
        let text = 'Oi, você tem um novo alerta para *' + ALERTS[alertId] + '*\n\n*' + message.sender.pushname + '* mandou a ' +
            'seguinte mensagem no grupo *' + message.chat.name + '*: \n\n'
        let notSend = []
        text += message.text
        for (let i = 0; typeof users[i] !== "undefined"; i++){
            if (users[i].id !== message.author){
                let sended = await client.sendText(users[i].id, text)
                if (!sended.startsWith('true')){
                    notSend.push(users[i].id)
                }
            }
        }

        if (notSend.length !== 0){
            await client.sendText(admin[0], notSend.join())
        }
    }
}

module.exports = AlertUsers