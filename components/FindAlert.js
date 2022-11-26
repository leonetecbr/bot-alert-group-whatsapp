import alertUsers from './AlertUsers.js'

export async function FindAlert(message, client, alerts) {
    let found = {
        message: message,
        alerts: []
    }

    // Verifica se a mensagem tem palavras
    if (message.words.length === 0) return false

    alerts.map(alert => {
        const name = '#' + alert.name

        // Se existir o alerta nas palavras da mensagem
        if (message.words.includes(name)) {
            // Se ainda não tiver encontrado nenhum alerta
            if (found.alerts.length === 0) {
                // Define se o alerta deve ser enviado da mensagem que lançou o alerta ou da mensagem respondida
                let reply = false
                // Se existir uma mensagem respondida
                if (message.quotedMsgObj !== null) {
                    // Se o tamanho da mensagem for exatamente o tamanho do alerta lançado, ela é uma resposta
                    if (message.text.length === name.length) reply = true
                    else if (message.words.length > 1) {
                        reply = true

                        // Verifica se todas as palavras da mensagem são alertas, se for ela é uma resposta
                        for (let i = 0; typeof message.words[i] !== 'undefined'; i++) {
                            let equal = false

                            // Verifica se a palavra é um alerta
                            for (let j = 0; typeof alerts[j] !== 'undefined'; j++) {
                                const name = '#' + alerts[j].name

                                if (message.words[i] === name) {
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
                } else{
                    console.log(message)
                }

                // Se o alerta for resposta a outra mensagem, envia um alerta para a mensagem respondida
                if (reply) found.message = message.quotedMsgObj
            }
            // Adiciona o alerta a lista de alertas encontrados
            found.alerts.push(alert.id)
        }
    })

    // Envia uma mensagem de resposta marcando os usuários que tem os alertas ativados
    if (found.alerts.length !== 0) await alertUsers(found, client)
}

export default FindAlert