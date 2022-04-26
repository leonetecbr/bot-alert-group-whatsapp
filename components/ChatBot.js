const database = require('../databases/db')
const ALERTS = require('../resources/alerts.json')
const Users = require('../models/User')

async function ChatBot(message){

    message.text = message.text.toLowerCase()
    if (message.text === 'meus alertas'){
        await database.sync()

        // Busca pelo usuário no banco de dados
        let user = await Users.findByPk(message.from)

        // Se o usuário não existir no banco de dados
        if (user === null){
            user = await Users.create({
                id: message.from
            })
        }

        // Lista os alertas disponíveis
        let text = 'Os alertas disponíveis são:\n'
        for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
            text += '\n ```'+ALERTS[i]+'```: '
            text += (user['a'+i])?'*Ativado* ✅':'*Desativado* ❌'
        }
        return text
    }

    // Se tiver sintaxe de alerta
    if (message.text.startsWith('#') && message.length > 1) {
        let action = true
        for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
            // Se existir o alerta na mensagem
            if (message.text.search(ALERTS[i]) !== -1) {
                await database.sync()

                // Busca pelo usuário no banco de dados
                let user = await Users.findByPk(message.from)

                // Se o comando for para desativar o alerta
                if (message.text.replace(ALERTS[i] + ' ', '').search('off') !== -1) action = false
                // Se o usuário não existir no banco de dados
                if (user === null) {
                    let data = {
                        id: message.from
                    }
                    data['a' + i] = action
                    // Registra o usuário no banco
                    user = await Users.create(data)
                } else {
                    user['a' + i] = action
                    // Altera o registro do usuário
                    await user.save()
                }

                // Confirma a ativação ou desativação do alerta
                return (action) ? '*Alerta para ' + ALERTS[i] + ' ativado!* ✅' : '*Alerta para ' + ALERTS[i] + ' desativado!* ❌'
            }
        }
    }

    // Se não for nenhum alerta ou algum comando
    return 'Oi, aqui você pode gerenciar seus alertas, para ver quais alertas estão ativados ou desativados e para ' +
        'consultar a lista de alertas disponíveis me mande ```Meus Alertas```, para ativar me mande o nome do alerta' +
        ', por exemplo, ```'+ALERTS[1]+'```, para desativar mande o nome do alerta seguido de "off", por exemplo, ```'+ALERTS[1]+' off```'
}

module.exports = ChatBot