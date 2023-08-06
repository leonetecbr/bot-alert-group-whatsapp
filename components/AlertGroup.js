const {Alerted} = require('../models')

module.exports = async (client, found, users, text) => {
    async function registerSend(sendedMessage, message, text, alerts){
        console.log('Texto enviado: ', text)
        console.log('Id da mensagem: ', sendedMessage.id._serialized)
        console.log('Id da mensagem respondida: ', message.id._serialized)

        // Envia uma reação para a mensagem original
        message.react('✅').catch(e => console.log(e))

        // Salva o ‘id’ da mensagem no banco de dados
        Alerted.create({
            messageId: sendedMessage.id._serialized,
            alertedMessageId: message.id._serialized,
        })
            .then(alerted => alerted.setAlerts(alerts).catch(e => console.log(e)))
            .catch(e => console.log(e))
    }

    console.log('Membros com o(s) alerta(s) ativo(s): ', users)

    let mentions = []
    const message = found.message

    // Monta o texto da mensagem
    for (const id of users){
        const user = await client.getContactById(id)

        text += '@' + user.id.user + ' '
        mentions.push(user)
    }

    // Tenta envia mensagem no grupo como resposta, caso não consiga envia como mensagem normal
    message.reply(text, {mentions})
        .then(sendedMessage => registerSend(sendedMessage, message, text, found.alerts))
        .catch(e => {
            console.log(e)
            message.chat.sendMessage(text, {mentions})
                .then(sendedMessage => registerSend(sendedMessage, message, text, found.alerts))
                .catch(e => console.log(e))
        })

    // Para o "digitando ..."
    message.chat.clearState().catch(e => console.log(e))
}