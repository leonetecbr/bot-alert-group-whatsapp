const ALERTS = require('../resources/alerts.json')
const database = require('../databases/db')
const User = require('../models/User')

async function AlertUsers(message, alertId, client){
    await database.sync()
    let where = {}
    where['a'+alertId] = true

    let users = await User.findAll({where: where, raw: true})

    // Se existirem usuários com o alerta ativado
    if (users.length !== 0){
        let text = 'Oi, você tem um novo alerta para *' + ALERTS[alertId] + '*\n\n*' + message.sender.pushname + '* mandou a ' +
            'seguinte mensagem no grupo *' + message.chat.name + '*: \n\n'
        text += message.text

        for (let i = 0; i < users.length; i++){
            // Se não for o usuário que lançou o alerta
            if (users[i].id !== message.author){
                // Envie o alerta
                await client.sendText(users[i].id, text)
            }
        }
    }
}

module.exports = AlertUsers