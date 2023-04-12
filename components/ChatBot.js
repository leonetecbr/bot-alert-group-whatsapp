import User from '../models/User.js'
import Alert from '../models/Alert.js'
import AlertUser from '../models/AlertUser.js'
import processURL from './ProcessURL.js'
import {readFile} from 'fs/promises';

const states = JSON.parse(await readFile('./resources/UFs.json', 'utf8'))
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

export async function ChatBot(message) {
    if (message.text === 'meus alertas') {
        await User.sync()

        // Busca pelo usuário no banco de dados
        let user = await User.findByPk(message.from, {
            include: {
                model: AlertUser,
                as: 'alerts',
                attributes: ['AlertId',],
            },
            attributes: ['privateAlerts', 'state', 'capital',]
        })

        // Se o usuário não existir, cria
        if (user === null) user = await User.build({id: message.from}).save()

        await Alert.sync()

        const alertMethod = (!user.privateAlerts) ? 'grupo' : 'privado'

        // Lista os alertas disponíveis
        let text = 'Seus alertas são enviados no *' + alertMethod + '*!\n\nOs alertas disponíveis são:\n'
        const alerts = await Alert.findAll({
            raw: true,
            attributes: ['name', 'id',],
        })
        let activeAlerts = []

        if (user.alerts !== undefined) user.alerts.map(alert => activeAlerts.push(alert.AlertId))

        alerts.map(alert => {
            const name = '#' + alert.name

            text += '\n```' + name + '```: ' + ((activeAlerts.includes(alert.id)) ? '*Ativado* ✅' : '*Desativado* ❌')
        })

        text += '\n\nEstado: ' + ((user.state === null) ? '*Não definido* ❌' : '*' + user.state.toUpperCase() + '* ✅')
        text += '\nCapital: ' + ((user.capital) ? '*Ativado* ✅' : '*Desativado* ❌')

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
            '```' + name + ' off```. Para ativar ou desativar o alerta para o estado ou capital do estado que você ' +
            'definiu, mande # seguido da sigla do seu estado por exemplo ```#SP```, para alertas de capital use ' +
            '```#capital```'
    }
    // Se tiver sintaxe de alerta
    else if (message.text.startsWith('#') && message.text.length > 1) {
        // Ação padrão é ativar o alerta
        let action = true

        // Se o comando for para desativar o alerta
        if (message.words[1] === 'off') action = false

        // Verifica se é uma tag de alerta regional
        for (let i = 0; i < states.length; i++) {
            const name = '#' + states[i]

            if (message.words[0] === name || message.words[0] === '#capital') {
                await User.sync()

                // Busca pelo usuário no banco de dados
                let user = await User.findByPk(message.from, {
                    attributes: ['id', 'state', 'capital',],
                })

                // Se o usuário não existir, cria
                if (user === null) user = await User.build({id: message.from}).save()

                // Se estiver tentando modificar as configurações de capital sem definir um estado, informa o erro
                if (message.words[0] === '#capital' && user.state === null) return 'Você precisa definir um estado antes de ativar o alerta para a capital!'

                // Ativa ou desativa o alerta
                if (action) {
                    // Se o alerta for para a capital
                    if (message.words[0] === '#capital'){
                        // Se o alerta para a capital já estiver ativado, não faz nada
                        if (user.capital) return 'O alerta para capital do estado ```' + user.state + '``` já está ativado!'
                        // Se o alerta não estava ativo, ativa
                        user.capital = true
                    }
                    // Se o alerta for para o estado
                    else {
                        // Se o alerta para o estado já estiver ativado, não faz nada
                        if (user.state === states[i]) return 'O alerta para o estado ```' + user.state + '``` já está ativado!'
                        // Se o alerta não estava ativo, ativa
                        user.state = states[i]
                    }
                } else {
                    // Se o alerta for para a capital
                    if (message.words[0] === '#capital'){
                        // Se o alerta para a capital já estiver desativado, não faz nada
                        if (!user.capital) return 'O alerta para capital do estado ```' + user.state + '``` já está desativado!'
                        // Se o alerta não estava desativo, ativa
                        user.capital = true
                    }
                    // Se o alerta for para o estado
                    else {
                        // Se o alerta para o estado já estiver desativado, não faz nada
                        if (user.state === null) return 'O alerta para estados já está desativado!'
                        // Se o alerta não estava desativado, ativa
                        user.set({
                            state: null,
                            capital: false,
                        })
                    }
                }
                // Salva as alterações no banco de dados
                await user.save()

                // Confirma a ativação ou desativação do alerta
                return '*Alerta para ' + name + ' ' + ((action) ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }

        // Se não for, verifica se é uma tag de alerta normal
        await Alert.sync()

        // Busca todos os alertas no banco de dados
        const alerts = await Alert.findAll({raw: true, attributes: ['name', 'id']})

        for (let i = 0; i < alerts.length; i++) {
            const name = '#' + alerts[i].name

            if (message.words[0] === name) {
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

                await AlertUser.sync()

                // Ativa ou desativa o alerta
                if (action) {
                    // Se o alerta já estiver ativado, não faz nada
                    if (user.alerts !== undefined && user.alerts.some(alert => alert.AlertId === alerts[i].id)) return 'O alerta para ```' + name + '``` já está ativado!'
                    // Se o alerta não estava ativo, ativa
                    await AlertUser.create({UserId: message.from, AlertId: alerts[i].id})
                } else if (!action) {
                    // Se o alerta já estiver desativado, não faz nada
                    if (user.alerts === undefined || !user.alerts.some(alert => alert.AlertId === alerts[i].id)) return 'O alerta para ```' + name + '``` já está desativado!'
                    // Se o alerta estava ativo, desativa
                    await AlertUser.destroy({where: {UserId: message.from, AlertId: alerts[i].id}})
                }

                // Confirma a ativação ou desativação do alerta
                return '*Alerta para ' + name + ' ' + ((action) ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }
    }

    let url = message.textNormal.match(/https?:\/\/[-\w@:%.\\+~#?&/=,]+/g)

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