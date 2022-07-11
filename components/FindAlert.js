const ALERTS = require('../resources/alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let result = {alerted: false, messageId: null}
    let found = {
        message: message,
        alerts: []
    }

    // Enquanto existirem alertas a serem verificados
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        // Se existir o alerta na mensagem
        if (message.text.toLowerCase().search(ALERTS[i]) !== -1) {
            // Se ainda não tiver encontrado nenhum alerta
            if (result.messageId === null) {
                // Se o alerta for resposta a outra mensagem, envia um alerta para a mensagem respondida
                if (message.text.length === ALERTS[i].length && message.quotedMsgObj !== null) {
                    found.message = message.quotedMsgObj
                    result.messageId = message.quotedMsgObj.id
                } else result.messageId = message.id
            }
            // Adiciona o alerta a lista de alertas encontrados
            found.alerts.push(i)
        }
    }

    if (found.alerts.length !== 0) {
        // Envia uma mensagem para o usuário informando dos alertas encontrados
        await alertUsers(found, client)
        // Envia uma resposta para a mensagem alertada
        result.alerted = true
    }

    return result
}

module.exports = FindAlert