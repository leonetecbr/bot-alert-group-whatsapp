const wa = require('@open-wa/wa-automate')
const findAlert = require('./components/FindAlert')
const chatBot = require('./components/ChatBot')
const admin = require('./resources/admin.json')
const ALERTS = require("./resources/alerts.json");
const {cli} = require("@open-wa/wa-automate/dist/cli/setup");
let client

wa.create({
    sessionId: 'BOT_ALERT',
    multiDevice: true,
    authTimeout: 60,
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0
}).then(client => start(client))


function start(handle) {
    client = handle
    client.onMessage(processMessage)
    client.onAddedToGroup(processAddGroup)
}

// Processa mensagens recebidas em grupos e chats privados
async function processMessage(message){
    // Em grupos
    if (message.chat.isGroup){
        // Busca por alertas
        let result = await findAlert(message, client)
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

// Ações a ser realizadas após o bot ser adicionado em um grupo
async function processAddGroup(chat){
    let text = 'Olá pessoal do grupo *'+chat.name+'*, vou ajudar vocês a avisarem os demais participantes quando algo relevante acontecer, ' +
        'para isso basta enviar um dos alertas abaixo em uma mensagem ou responder uma mensagem com o alerta, quem ' +
        'desejar ser alertado pode entrar em contato comigo e ativar os alertas que mais te interessa!\n'
    text += '\nOs alertas disponíveis são:\n'
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        text += '\n```'+ALERTS[i]+'```'
    }

    await client.sendText(chat.id, text)
}