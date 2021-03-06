const ALERTS = require('../resources/alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let result = {alerted: false, messageId: null}
    let found = {
        message: message,
        alerts: []
    }

    // Separa cada palavra em um elemento do array
    if (message.text !== null) message.words = message.text.replace(/\n/g, ' ').split(' ')
    else message.words = []

    // Enquanto existirem alertas a serem verificados
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        // Se existir o alerta nas palavras da mensagem
        if (message.words.includes(ALERTS[i])) {
            // Se ainda não tiver encontrado nenhum alerta
            if (result.messageId === null) {
                // Define se o alerta deve ser enviado da mensagem que lançou o alerta ou da mensagem respondida
                let reply = false

                // Se existir uma mensagem respondida
                if (message.quotedMsgObj !== null) {
                    // Se o tamanho da mensagem for exatamente o tamanho do alerta lançado, ela é uma resposta
                    if (message.text.length === ALERTS[i].length) reply = true
                    else {
                        reply = true

                        // Verifica se todas as palavras da mensagem são alertas, se for ela é uma resposta
                        for (let i = 0; typeof message.words[i] !== 'undefined'; i++) {
                            let equal = false

                            for (let a = 1; typeof ALERTS[a] !== 'undefined'; a++) {
                                if (message.words[i] === ALERTS[a]) {
                                    equal = true
                                    break
                                }
                            }

                            if (!equal) {
                                reply = false
                                break
                            }
                        }
                    }
                }

                // Se o alerta for resposta a outra mensagem, envia um alerta para a mensagem respondida
                if (reply) found.message = message.quotedMsgObj
                result.messageId = found.message.id
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