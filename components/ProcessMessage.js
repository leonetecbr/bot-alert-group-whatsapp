const fs = require('fs')
const findAlert = require('./FindAlert')
const chatBot = require('./ChatBot')
const adminFile = 'resources/admin.json'
const admin = fs.existsSync(adminFile) ? require('../' + adminFile) : []

// Processa mensagens recebidas em grupos e chats privados
async function processMessage(client, message){
    // Em grupos
    if (message.chat.isGroup){
        // Busca por alertas
        const result = await findAlert(message, client)
        // Se encontrar um alerta em uma mensagem
        if (result.alerted)
            await client.reply(message.chat.id, '*Alerta enviado!*', result.messageId, true)
        // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    } else if (!message.sender.isEnterprise){
        // Envia o banco de dados para o administrador
        if (admin.includes(message.from) && message.text === '/admin') await client.sendFile(message.from, './db.sqlite', 'db.sqlite', 'Banco de dados', message.id)
        // Interage com os usuários comuns
        else await client.reply(message.from, await chatBot(message), message.id, true)
    }
}

module.exports = processMessage