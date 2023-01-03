import User from '../models/User.js'
import Alert from '../models/Alert.js'
import AlertUser from '../models/AlertUser.js'
import processURL from './ProcessURL.js'

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export async function ChatBot(message) {

    message.text = message.text.toLowerCase()
    if (message.text === 'meus alertas') {
        await User.sync()

        // Busca pelo usuário no banco de dados
        let user = await User.findByPk(message.from, {
            include: {
                model: AlertUser,
                as: 'alerts',
                attributes: ['AlertId',],
            },
            attributes: ['privateAlerts',],
        })

        await Alert.sync()

        const alertMethod = (user === null || !user.privateAlerts) ? 'grupo' : 'privado'

        // Lista os alertas disponíveis
        let text = 'Seus alertas são enviados no *' + alertMethod + '*!\n\nOs alertas disponíveis são:\n'
        const alerts = await Alert.findAll({
            raw: true,
            attributes: ['name', 'id',],
        })
        let activeAlerts = []

        if (user !== null) user.alerts.map(alert => activeAlerts.push(alert.AlertId))

        alerts.map(alert => {
            const name = '#' + alert.name

            text += '\n```' + name + '```: ' + ((activeAlerts.includes(alert.id)) ? '*Ativado* ✅' : '*Desativado* ❌')
        })

        return text
    } else if (message.text === 'ajuda') {
        await Alert.sync()

        const alerts = await Alert.findAll({
            raw: true,
            attributes: ['name',],
            limit: 1,
        })
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
                await User.sync()

                // Busca pelo usuário no banco de dados
                let user = await User.findByPk(message.from, {
                    include: {
                        model: AlertUser,
                        as: 'alerts',
                        attributes: ['AlertId'],
                    },
                    attributes: [],
                })

                // Se o usuário não existir, cria
                if (user === null) user = await User.create({id: message.from})

                // Se o comando for para desativar o alerta
                if (message.text.endsWith('off')) action = false

                await AlertUser.sync()

                // Ativa ou desativa o alerta
                if (action) {
                    // Se o alerta já estiver ativado, não faz nada
                    if (user.alerts.some(alert => alert.AlertId === alerts[i].id)) return 'O alerta para ```' + name + '``` já está ativado!'
                    // Se o alerta não estiver ativo, ativa
                    await AlertUser.create({UserId: message.from, AlertId: alerts[i].id})
                } else if (!action) {
                    // Se o alerta já estiver desativado, não faz nada
                    if (!user.alerts.some(alert => alert.AlertId === alerts[i].id)) return 'O alerta para ```' + name + '``` já está desativado!'
                    // Se o alerta estiver ativo, desativa
                    await AlertUser.destroy({where: {UserId: message.from, AlertId: alerts[i].id}})
                }

                // Confirma a ativação ou desativação do alerta
                return '*Alerta para ' + name + ' ' + ((action) ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }
    }

    let url = message.text.match(/(https?:\/\/[-\w@:%.\\+~#?&/=]+)/g)

    // Se a mensagem contiver um link ou mais, pega o primeiro link da mensagem e transforma em link de afiliados
    if (url !== null) url = await processURL(url[0])

    // Se o link de afiliados for gerado com sucesso, envia a mensagem
    if (url) return url

    const greetings = ['olá', 'oii', 'oe', 'oie', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'eae']
    let start = 'Oi' + ' ' + message.sender.pushname

    // Personaliza a saudação
    if (greetings.includes(message.text)) start = capitalize(message.text) + ' ' + message.sender.pushname

    // Se não for nenhum alerta ou algum comando
    return start + ', aqui você pode gerenciar seus alertas, para saber como me envie ```Ajuda```'
}

export default ChatBot