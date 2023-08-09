const {User, Alert} = require('../models')
const {Op} = require('sequelize')
const generateShopee = require('./GenerateShopee')
const processURL = require('./ProcessURL')
const alertPrivate = require('./AlertPrivate')
const alertGroup = require('./AlertGroup')

module.exports = async (client, chat, found) => {
    // Inicia o "digitando ..."
    chat.sendStateTyping().catch(e => console.log(e))

    console.log('_____________________________________________________________________________________________________')
    console.log('Texto da mensagem: ', found.message.text)
    console.log('Alertas encontrados: ', found.alerts)

    let groupUsers = [], privateUsers = [], text = 'Você tem um novo alerta para *', shopee = false
    const message = found.message
    let members = []

    for (const member of chat.participants) {
        members.push(member.id._serialized)
    }

    // Se tiver encontrado apenas um alerta
    if (found.alerts.length === 1) {
        const users = await User.findAll({
            where: {
                '$alerts.id$': found.alerts[0]
            },
            include: 'alerts',
            raw: true,
            attributes: ['id', 'privateAlerts'],
        })

        // Se tiver usuários com esse alerta ativado
        if (users) {
            const alert = await Alert.findOne({
                where: {
                    id: found.alerts[0]
                },
                attributes: ['name'],
                raw: true
            })

            for (const user of users) {
                // Verifica se o usuário quer receber os alertas no privado
                if (user.privateAlerts) privateUsers.push(user.id)
                // Se não, envia para o grupo
                else groupUsers.push(user.id)
            }

            // Se o alerta for do Shopee
            if (alert.name === 'shopee') shopee = true

            // Insere o nome do alerta no texto
            text += '#' + alert.name + '*\n\n'
        }
    }
    // Se tiver encontrado mais de um alerta
    else {
        const users = await User.findAll({
            where: {
                '$alerts.id$': {
                    [Op.or]: found.alerts
                }
            },
            include: 'alerts',
            attributes: ['id', 'privateAlerts'],
        })

        for (const user of users) {
            // Verifica se o usuário quer receber os alertas no privado
            if (user.privateAlerts) {
                // Evita que usuários sejam inseridos no array mais de uma vez
                if (!privateUsers.includes(user.id)) privateUsers.push(user.id)
            }
            // Se não, envia para o grupo
            else if (!groupUsers.includes(user.id)) groupUsers.push(user.id)
        }

        // Se tiver usuários com pelo menos um desses alertas ativado
        if (users) {
            let alerts = await Alert.findAll({
                where: {
                    id: {
                        [Op.or]: found.alerts
                    }
                },
                attributes: ['id', 'name'],
                raw: true
            })

            // Se algum dos alertas for do Shopee
            if (alerts.some(alert => alert.name === 'shopee')) shopee = true

            // Gera o título com o nome dos alertas
            for (const [i, alert] of alerts.entries()) {
                if (i !== 0 && i + 1 === alerts.length) text += '* e *'

                text += '#' + alert.name

                if (i + 3 <= alerts.length) text += '*, *'
            }

            text += '*\n\n'
        }
    }

    // Exclui usuários que não estão no grupo e o autor da(s) mensagem(ns)
    groupUsers = groupUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))
    privateUsers = privateUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (groupUsers.length === 0 && privateUsers.length === 0) {
        // Para o "digitando ..."
        message.chat.clearState().catch(e => console.log(e))
        // Marca a mensagem como lida
        message.chat.sendSeen().catch(e => console.log(e))
        return false
    }

    // Transforma links comuns em links de afiliados
    const links = message.text.match(/https?:\/\/[-\w@:%.\\+~#?&/=,]+/g)
    if (links) {
        for (const link of links){
            const url = await processURL(link)
            if (url) text += url + '\n\n'
        }
    } else if (shopee) {
        // const link = await generateShopee('https://shopee.com.br/cart')
        // text += '🛒 Link rápido pro carrinho: ' + link + '\n\n'
    }

    // Se tiver usuários que querem receber os alertas no grupo
    if (groupUsers.length > 0) alertGroup(client, found, groupUsers, text).then(() => console.log('Enviado para o grupo!'))

    // Se tiver usuários que querem receber os alertas no privado
    if (privateUsers.length > 0) alertPrivate().then(() => console.log('Enviado para o privado!'))
}