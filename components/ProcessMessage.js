const {Alert} = require('../models')
const findAlert = require('./FindAlert')
const alertUsers = require('./AlertUsers')
const easterEggs = require('./EasterEggs')
const commandsAdmin = require('./CommandsAdmin')
const chatBot = require('./ChatBot')

/**
 * Processa mensagens recebidas em grupos e chats privados
 *
 * @return {Promise<import('whatsapp-web.js').Message>}
 */
module.exports = async (client, message) => {
    const alerts = await Alert.findAll();

    // Lista de administradores
    const admins = process.env.ADMINS.split(',')

    // Trata a mensagem recebida para evitar erros
    message.body = message.body ?? ''

    // Armazena a mensagem original para ser usada na busca por links
    message.text = message.body

    // Passa toda a mensagem para minúsculo
    message.body = message.body.toLowerCase()

    // Separa cada palavra em um elemento do array
    message.words = message.body.replace(/\n/g, ' ').split(' ')

    // Obtém detalhes do chat
    message.chat = await message.getChat()

    // Obtém detalhes de quem enviou
    message.sender = await message.getContact()

    // Em grupos, busca por alertas nas mensagens recebidas,
    if (message.chat.isGroup) {
        const found = await findAlert(message, alerts)

        // Envia uma mensagem de resposta marcando os usuários com os alertas ativados
        if (found.alerts.length !== 0) await alertUsers(client, message.chat, found)
        // Se não encontrar alerta, procura por easter eggs
        else if (message.mentionedIds.length !== 0) await easterEggs(client.info.wid, message, alerts)
        // Marca a mensagem como lida
        else message.chat.sendSeen().catch(e => console.log(e))
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    } else if (!message.sender.isEnterprise) {
        // Inicia o "digitando ..."
        message.chat.sendStateTyping().catch(e => console.log(e))

        if (admins.includes(message.from) && message.body.startsWith('/') && message.words.length === 2){
            await commandsAdmin(message)
        } else message.reply(await chatBot(message)).catch(e => console.log(e))

        // Para o "digitando ..."
        message.chat.clearState().catch(e => console.log(e))
    }

    return message
}