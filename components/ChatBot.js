const Users = require('../models/User')
const Alert = require('../models/Alert')
const AlertUser = require('../models/AlertUser')

async function ChatBot(message) {

    message.text = message.text.toLowerCase()
    if (message.text === 'meus alertas') {
        await Users.sync()

        // Busca pelo usuário no banco de dados
        let user = await Users.findByPk(message.from, {
            include: {
                model: AlertUser,
                attributes: ['AlertId'],
            }
        })

        await Alert.sync()

        // Lista os alertas disponíveis
        let text = 'Os alertas disponíveis são:\n'
        const alerts = await Alert.findAll({raw: true, attributes: ['name', 'id']})
        let activeAlerts = []

        if (user !== null) user.AlertUsers.map(alert => activeAlerts.push(alert.AlertId))

        alerts.map(alert => {
            const name = '#' + alert.name

            text += '\n```' + name + '```: ' + ((activeAlerts.includes(alert.id)) ? '*Ativado* ✅' : '*Desativado* ❌')
        })

        return text
    } else if (message.text === 'ajuda') {
        await Alert.sync()

        const alerts = await Alert.findAll({raw: true, attributes: ['name'], limit: 1})
        const name = '#' + alerts[0].name

        // Envia texto de ajuda
        return 'Para ver quais alertas estão ativados ou desativados e para consultar a lista de alertas ' +
            'disponíveis me mande ```Meus Alertas```, para ativar me mande o nome do alerta, por exemplo,' +
            ' ```' + name + '```, para desativar mande o nome do alerta seguido de "off", por exemplo, ' +
            '```' + name + ' off```'
    }
    // Se tiver sintaxe de alerta
    else if (message.text.startsWith('#') && message.text.length > 1) {
        await Alert.sync()

        let action = true
        const alerts = await Alert.findAll({raw: true, attributes: ['name', 'id']})

        for (let i = 0; i < alerts.length; i++) {
            const name = '#' + alerts[i].name

            if (message.text.startsWith(name)) {
                await Users.sync()

                // Busca pelo usuário no banco de dados
                let user = await Users.findByPk(message.from, {
                    include: {
                        model: AlertUser,
                        attributes: ['AlertId'],
                    }
                })

                // Se o usuário não existir, cria
                if (user === null) {
                    user = await Users.create({id: message.from})
                }

                // Se o comando for para desativar o alerta
                if (message.text.endsWith('off')) action = false

                await AlertUser.sync()

                // Ativa ou desativa o alerta
                if (action) await AlertUser.create({UserId: message.from, AlertId: alerts[i].id})
                else await AlertUser.destroy({where: {UserId: message.from, AlertId: alerts[i].id}})

                // Confirma a ativação ou desativação do alerta
                return '*Alerta para ' + name + ' ' + ((action) ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }
    }

    // Se não for nenhum alerta ou algum comando
    return 'Oi, aqui você pode gerenciar seus alertas, para saber como me envie ```Ajuda```'
}

module.exports = ChatBot