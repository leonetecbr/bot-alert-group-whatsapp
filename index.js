const wa = require('@open-wa/wa-automate')
const findAlert = require('./components/FindAlert')
const chatBot = require('./components/ChatBot')
const {cli} = require("@open-wa/wa-automate/dist/cli/setup");

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
    console.log(message)
    message.text = message.text.toLowerCase()

    if (message.chat.isGroup){
      if (await findAlert(message, client)){
        await client.reply(message.chat.id, '*Alerta enviado!*', message.id, true)
      }
    } else{
      await client.reply(message.from, await chatBot(message), message.id, true)
    }
  })
}