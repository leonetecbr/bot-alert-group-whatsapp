const {User, Alert} = require('../models')
const processURL = require('./ProcessURL')
const states = [
    'ac', 'al', 'ap', 'am', 'ba', 'ce', 'df', 'es', 'go', 'ma', 'mt', 'ms', 'mg', 'pa',
    'pb', 'pr', 'pe', 'pi', 'rj', 'rn', 'rs', 'ro', 'rr', 'sc', 'sp', 'se', 'to'
]
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

module.exports = async message => {
    if (message.body === 'meus alertas') {
        // Busca pelo usuário no banco de dados e se não existir, cria
        const user = (await User.findOrCreate({
            where:{
                id: message.from
            },
            attributes: ['id', 'privateAlerts', 'state', 'capital',],
        }))[0]

        // Define o método de alerta do usuário
        const alertMethod = (!user.privateAlerts) ? 'grupo' : 'privado'

        // Lista os alertas disponíveis
        let text = 'Seus alertas são enviados no *' + alertMethod + '*!\n\nOs alertas disponíveis são:\n'
        const alerts = await Alert.findAll({
            raw: true,
            attributes: ['name', 'id',],
        })

        let activeAlerts = []
        const userAlerts = await user.getAlerts()
        for (const alert of userAlerts) {
            activeAlerts.push(alert.id)
        }

        for (const alert of alerts){
            const name = '#' + alert.name

            text += '\n```' + name + '```: ' + (activeAlerts.includes(alert.id) ? '*Ativado* ✅' : '*Desativado* ❌')
        }

        text += '\n\nEstado: ' + (user.state ? '*' + user.state.toUpperCase() + '* ✅' : '*Não definido* ❌')
        text += '\nCapital: ' + (user.capital ? '*Ativado* ✅' : '*Desativado* ❌')

        return text
    } else if (message.body === 'ajuda') {
        const alert = await Alert.findOne({
            raw: true,
            attributes: ['name',],
        })
        const name = '#' + alert.name

        // Envia texto de ajuda
        return 'Para ver quais alertas estão ativados ou desativados e para consultar a lista de alertas ' +
            'disponíveis me mande ```Meus Alertas```, para ativar me mande o nome do alerta, por exemplo,' +
            ' ```' + name + '```, para desativar mande o nome do alerta seguido de "off", por exemplo, ' +
            '```' + name + ' off```, você também pode usar ```#todos``` para ativar todos os alertas ' +
            'disponíveis no momento. Para ativar ou desativar o alerta para o estado ou capital do estado que você ' +
            'definiu, mande # seguido da sigla do seu estado por exemplo ```#SP```, para alertas de capital use ' +
            '```#capital```'
    }
    // Se tiver sintaxe de alerta
    else if (message.body.startsWith('#') && message.body.length > 1) {
        // Ação padrão é ativar o alerta
        let action = true

        // Se o comando for para desativar o alerta
        if (message.words[1] === 'off') action = false

        // Verifica se é uma tag de alerta regional
        for (const state of states) {
            const name = '#' + state

            if (message.words[0] === name || message.words[0] === '#capital') {

                // Busca pelo usuário no banco de dados e se não existir, cria
                const user = (await User.findOrCreate({
                    where:{
                        id: message.from
                    },
                    attributes: ['id', 'state', 'capital',],
                }))[0]

                // Se estiver tentando modificar as configurações de capital sem definir um estado, informa o erro
                if (message.words[0] === '#capital' && !user.state) return 'Você precisa definir um estado antes de ativar o alerta para a capital!'

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
                        if (user.state === state) return 'O alerta para o estado ```' + user.state + '``` já está ativado!'
                        // Se o alerta não estava ativo, ativa
                        user.state = state
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
                return '*Alerta para ' + name + ' ' + (action ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }

        // Se não for, verifica se é uma tag de alerta normal
        // Busca todos os alertas no banco de dados
        const alerts = await Alert.findAll({attributes: ['name', 'id']})

        if (message.words[0] === '#todos'){
            // Busca pelo usuário no banco de dados e se não existir, cria
            const user = (await User.findOrCreate({
                where:{
                    id: message.from
                },
                attributes: ['id'],
            }))[0]

            let alertsId = []

            for (const alert of alerts){
                alertsId.push(alert.id)
            }

            // Ativa todos os alertas
            if (action) await user.setAlerts(alertsId)
            // Desativa todos os alertas
            else await user.setAlerts([])

            // Confirma a ativação ou desativação do alerta
            return '*Todos os seus alertas foram ' + (action ? 'ativados!* ✅' : 'desativados!* ❌')
        }

        for (const alert of alerts) {
            const name = '#' + alert.name

            if (message.words[0] === name) {
                // Busca pelo usuário no banco de dados e se não existir, cria
                const user = (await User.findOrCreate({
                    where:{
                        id: message.from
                    },
                    attributes: ['id'],
                }))[0]

                const activatedAlerts = await user.getAlerts()

                // Ativa ou desativa o alerta
                if (action) {
                    // Se o alerta já estiver ativado, não faz nada
                    if (activatedAlerts.some(activatedAlert => activatedAlert.id === alert.id)) return 'O alerta para ```' + name + '``` já está ativado!'
                    // Se o alerta não estava ativo, ativa
                    await user.addAlerts(alert.id)
                } else if (!action) {
                    // Se o alerta já estiver desativado, não faz nada
                    if (!activatedAlerts.some(activatedAlert => activatedAlert.id === alert.id)) return 'O alerta para ```' + name + '``` já está desativado!'
                    // Se o alerta estava ativo, desativa
                    await user.removeAlerts(alert.id)
                }

                // Confirma a ativação ou desativação do alerta
                return '*Alerta para ' + name + ' ' + (action ? 'ativado!* ✅' : 'desativado!* ❌')
            }
        }

        return message.words[0] + ' não é um alerta disponível! ❌'
    } else if (message.hasMedia) {
        const media = await message.downloadMedia();

        if (media) return media
    }

    let url = message.text.match(/https?:\/\/[-\w@:%.\\+~#?&/=,]+/g)

    // Se a mensagem contiver um link ou mais, pega o primeiro link da mensagem e transforma em link de afiliados
    if (url !== null) url = await processURL(url[0])

    // Se o link de afiliados for gerado com sucesso, envia a mensagem
    if (url) return url

    const greetings = ['olá', 'oii', 'oe', 'oie', 'bom dia', 'boa tarde', 'boa noite', 'eai', 'eae']
    let start = 'Oi' + ' ' + message.sender.pushname

    // Personaliza a saudação
    if (greetings.includes(message.body)) start = capitalize(message.body) + ' ' + message.sender.pushname

    // Se não for nenhum alerta ou algum comando
    return start + ', aqui você pode gerenciar seus alertas, para saber como me envie ```Ajuda```'
}