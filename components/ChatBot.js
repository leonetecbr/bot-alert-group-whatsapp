const database = require('../databases/db')
const ALERTS = require('../resources/alerts.json')
const Users = require('../models/User')

async function ChatBot(message){

    message.text = message.text.toLowerCase()
    if (message.text === 'meus alertas'){
        await database.sync()

        let user = await Users.findByPk(message.from)

        if (user === null){
            user = await Users.create({
                id: message.from
            })
            await user.save()
        }

        let text = 'Os alertas disponíveis são:\n'
        for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
            text += '\n ```'+ALERTS[i]+'```: '
            text += (user['a'+i])?'*Ativado* ✅':'*Desativado* ❌'
        }
        return text
    }

    let action = true
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        if(message.text.search(ALERTS[i]) !== -1){
            await database.sync()

            let user = await Users.findByPk(message.from)

            if (message.text.replace(ALERTS[i]+' ', '') === 'off') action = false
            if (user === null){
                let data = {
                    id: message.from
                }
                data['a'+i] = action
                user = await Users.create(data)
                await user.save()
            } else{
                user['a'+i] = action
                await user.save()
            }

            return (action)?'*Alerta para '+ALERTS[i]+' ativado!* ✅':'*Alerta para '+ALERTS[i]+' desativado!* ❌'
        }
    }

    return 'Oi, aqui você pode gerenciar seus alertas, para ver quais alertas estão ativados ou desativados e para ' +
        'consultar a lista de alertas disponíveis me mande ```Meus Alertas```, para ativar me mande o nome do alerta' +
        ', por exemplo, ```#bug```, para desativar mande o nome do alerta seguido de "off", por exemplo, ```#bug off```'
}

module.exports = ChatBot