export async function FindAlert(message, alerts) {
    let found = {
        message: message,
        alerts: [],
        ignore: [message.author,],
    }

    const matches = message.text.match(/#\w+/g)
    let lastMessage = message.lastMessage ?? null

    // Verifica se tem possíveis alertas na mensagem
    if (matches === null) return found

    matches.map((match, i, macthes) => {
        // Retira a # do inicio do alerta
        match = match.substring(1)

        // Verifica se o alerta existe
        const alert = alerts.filter(alert => alert.name === match)

        if (alert.length > 0) {
            // Adiciona o alerta a lista de alertas encontrados
            found.alerts.push(alert[0].id)
            // Se for o último item, existir uma mensagem respondida e a quantidade palavras e alertas forem iguais,  o alerta é referente a mensagem respondida
            if (i + 1 === macthes.length && message.quotedMsgObj !== null && message.words.length === found.alerts.length) {
                // Envia um alerta para a mensagem respondida
                found.message = message.quotedMsgObj
                found.message.textNormal = message.quotedMsgObj.text
                found.ignore.push(message.quotedMsgObj.author)
            }
            // Se não for uma resposta, o autor da mensagem for o mesmo da mensagem anterior e a quantidade palavras e alertas forem iguais, o alerta é referente a mensagem anterior
            else if (lastMessage !== null && message.words.length === found.alerts.length && message.author === lastMessage.author) {
                // Envia um alerta para a penultima mensagem
                found.message = lastMessage
                found.message.textNormal = lastMessage.text
            }
        }
    })

    return found
}

export default FindAlert