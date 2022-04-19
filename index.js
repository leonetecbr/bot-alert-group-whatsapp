const wa = require('@open-wa/wa-automate')
const findAlert = require('./components/FindAlert')
const chatBot = require('./components/ChatBot')
const admin = require('./resources/admin.json')

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


function start(client) {
  client.onMessage(async message => {

    if (message.chat.isGroup){
      // Se encontrar um alerta em uma mensagem
      if (await findAlert(message, client)) await client.reply(message.chat.id, '*Alerta enviado!*', message.id, true)
    } else{
      // Envia o banco de dados para o administrador
      if (admin.includes(message.from) && message.text === '/admin') await client.sendFile(message.from, './db.sqlite', 'db.sqlite', 'Banco de dados')
      // Interage com os usuários comuns
      else await client.reply(message.from, await chatBot(message), message.id, true)
    }
  })
}