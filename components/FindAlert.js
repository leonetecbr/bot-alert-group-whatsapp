const ALERTS = require('../resources/alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let alerted = false
    // Enquanto existirem alertas a serem verificados
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        // Se existir o alerta na mensagem
        if (message.text.toLowerCase().search(ALERTS[i]) !== -1) {
            // Se o alerta for resposta a outra mensagem
            if (message.text.length === ALERTS[i].length && message.quotedMsgObj !== null && message.quotedMsgObj.text !== ''){
                // Envia um alerta para a mensagem respondida
                await alertUsers(message.quotedMsgObj, i, client)
            } else await alertUsers(message, i, client)
            // Envia um alerta para a mensagem
            alerted = true
        }
    }
    return alerted
}

module.exports = FindAlert