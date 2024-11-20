const {Alert, Alerted} = require('../models')
const {Op} = require('sequelize')
const generateShopee = require('./GenerateShopee')
const processURL = require('./ProcessURL')

module.exports = async (client, found, users) => {
    function registerSend(sentMessage, message, text, alerts){
        console.log('Texto enviado no grupo: ', text)
        console.log('Id da mensagem enviada no grupo: ', sentMessage.id._serialized)
        console.log('Id da mensagem respondida: ', message.id._serialized)

        // Envia uma reação para a mensagem original
        message.react('✅').catch(e => console.log(e))

        // Salva o ‘id’ da mensagem no banco de dados
        Alerted.create({
            messageId: sentMessage.id._serialized,
            alertedMessageId: message.id._serialized,
        })
            .then(alerted => alerted.setAlerts(alerts).catch(e => console.log(e)))
            .catch(e => console.log(e))
    }

    console.log('Membros com o(s) alerta(s) ativo(s) para receber no grupo: ', users)

    const message = found.message
    const alerts = await Alert.findAll({
        where: {
            id: {
                [Op.or]: found.alerts
            }
        },
        attributes: ['id', 'name'],
        raw: true
    })
    // Se algum dos alertas for da Shopee
    const shopee = alerts.some(alert => alert.name === 'shopee')
    let mentions = [], text = 'Você tem um novo alerta para *'

    // Gera o título com o nome dos alertas
    for (const [i, alert] of alerts.entries()) {
        if (i !== 0 && i + 1 === alerts.length) text += '* e *'

        text += '#' + alert.name

        if (i + 3 <= alerts.length) text += '*, *'
    }

    text += '*\n\n'

    // Transforma links comuns em links de afiliados
    const links = message.text.match(/https?:\/\/[-\w@:%.\\+~#?&/=,]+/g)
    if (links) {
        for (const link of links){
            const url = await processURL(link)
            if (url) text += url + '\n\n'
        }
    } else if (shopee) {
        const link = await generateShopee('https://shopee.com.br/cart')
        
        if (link) text += '🛒 Link rápido pro carrinho: ' + link + '\n\n'
    }

    // Monta o texto da mensagem
    for (const id of users){
        text += '@' + id.split('@')[0] + ' '
        mentions.push(id)
    }

    // Tenta envia mensagem no grupo como resposta, caso não consiga envia como mensagem normal
    message.chat.sendMessage(text, {mentions, quotedMessageId: message.id._serialized})
        .then(sentMessage => registerSend(sentMessage, message, text, found.alerts))
        .catch(e => {
            console.log(e)
            message.chat.sendMessage(text, {mentions})
                .then(sentMessage => registerSend(sentMessage, message, text, found.alerts))
                .catch(e => console.log(e))
        })

    // Marca a mensagem como lida
    message.chat.sendSeen().catch(e => console.log(e))

    // Para o "digitando ..."
    message.chat.clearState().catch(e => console.log(e))
}
