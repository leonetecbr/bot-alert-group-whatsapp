const {Alert} = require('../models')
const findAlert = require('./FindAlert')
const alertUsers = require('./AlertUsers')
const easterEggs = require('./EasterEggs')
const commandsAdmin = require('./CommandsAdmin')
const chatBot = require('./ChatBot')
const {MessageMedia} = require('whatsapp-web.js')

/**
 * Processa mensagens recebidas em grupos e chats privados
 */
module.exports = async (client, message) => {
    const alerts = await Alert.findAll()

    // Lista de administradores
    const admins = process.env.ADMINS.split(',')

    // Trata a mensagem recebida para evitar erros
    message.body = message.body ?? ''

    // Passa toda a mensagem para minúsculo
    message.body = message.body.toLowerCase()

    // Separa cada palavra em um elemento do array
    message.words = message.body.replace(/\n/g, ' ').split(' ')

    // Obtém detalhes do chat
    await message.getChat()
        .then(chat => message.chat = chat)
        .catch(e => console.log(e))

    // Obtém detalhes de quem enviou
    await message.getContact()
        .then(contact => message.sender = contact)
        .catch(e => console.log(e))

    // Se não tiver sido possível obter os dados, encerra a função
    if (!message.sender || !message.chat) return;

    // Em grupos, busca por alerta nas mensagens recebidas,
    if (message.chat.isGroup) {
        // Ignora se não poder lançar alertas
        if (message.chat.isReadOnly) return;

        findAlert(message, alerts).then(found => {
            // Envia uma mensagem de resposta marcando os usuários com os alertas ativados
            if (found.alerts.length !== 0) alertUsers(client, message.chat, found)
            // Se não encontrar alerta, procura por easter eggs
            else if (message.mentionedIds.length !== 0) easterEggs(client.info.wid, message, alerts)
            // Marca a mensagem como lida
            else message.chat.sendSeen().catch(e => console.log(e))
        }).catch(e => console.log(e))
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    } else if (!message.sender.isEnterprise) {
        // Inicia o "digitando ..."
        message.chat.sendStateTyping().catch(e => console.log(e))

        if (admins.includes(message.from) && message.body.startsWith('/') && message.words.length === 2) {
            commandsAdmin(message).catch(e => console.log(e))
        } else {
            chatBot(message).then(text => {
                if (typeof text === 'string') message.reply(text).catch(e => console.log(e))
                else if (text instanceof MessageMedia) {
                    message.reply(text, message.chat.id._serialized, {
                        sendMediaAsSticker: true,
                        stickerAuthor: 'Por: @leone.tec.br',
                        stickerName: 'Via bot de alerta',
                    }).catch(e => console.log(e))
                }
            })
        }

        // Para o "digitando ..."
        message.chat.clearState().catch(e => console.log(e))
    }

    return message
}