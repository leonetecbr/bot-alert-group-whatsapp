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
        let url
        let text = 'Oi, você tem um novo alerta para *' + ALERTS[alertId] + '*\n\n*' + message.sender.pushname + '* mandou a ' +
            'seguinte mensagem no grupo *' + message.chat.name + '*: \n\n'
        text += message.text

        if (message.text.indexOf('https://') !== -1) {
            // Se tiver um link na mensagem busca ele
            let re = /https:\/\/[\w-./:=&"'?%+@#$!()]+/
            let matches = message.text.match(re)
            url = matches[0]
        }

        for (let i = 0; i < users.length; i++){
            // Se não for o usuário que lançou o alerta
            if (users[i].id !== message.author){
                // Envie o alerta
                if (message.text.indexOf('https://') !== -1) {
                    // Se tiver um link no texto envia a mensagem com um preview
                    await client.sendLinkWithAutoPreview(users[i].id, url, text)
                } else {
                    await client.sendText(users[i].id, text)
                }
            }
        }
    }
}

module.exports = AlertUsers