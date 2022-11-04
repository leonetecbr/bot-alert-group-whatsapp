const fs = require('fs')
const findAlert = require('./FindAlert')
const chatBot = require('./ChatBot')
const adminFile = 'resources/admin.json'
const admin = fs.existsSync(adminFile) ? require('../' + adminFile) : []

// Processa mensagens recebidas em grupos e chats privados
async function processMessage(client, message){
    // Em grupos, busca por alertas nas mensagens recebidas
    if (message.chat.isGroup) await findAlert(message, client)
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    else if (!message.sender.isEnterprise){
        // Interage com o administrador quando ele envia um comando
        if (admin.includes(message.from) && message.text.startsWith('/')) {
            // TODO Comandos de administrador
        }
        // Interage com os usuários comuns
        else await client.reply(message.from, await chatBot(message), message.id, true)
    }
}

module.exports = processMessage