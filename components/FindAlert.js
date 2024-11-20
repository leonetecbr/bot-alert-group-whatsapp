/**
 * Busca por alertas nas mensagens recebidas dos grupos
 *
 * @return {Promise<{alerts: *[], ignore: string[], message: import('whatsapp-web.js').Message}>}
 */
module.exports = async (message, alerts) => {
    let found = {
        message: message,
        alerts: [],
        ignore: [message.author,],
    }

    if (process.env.USERS_IGNORE.split(',').includes(message.author)) return found

    const matches = message.body.match(/#[\wà-ú]+/g)

    // Verifica se tem possíveis alerta na mensagem
    if (matches === null) return found

    const foundNumber = matches.length

    for (let [i, match] of matches.entries()){
        // Retira a # do inicio do alerta
        match = match.substring(1)

        // Verifica se o alerta existe
        const alert = alerts.filter(alert => alert.name === match)

        if (alert.length > 0) {
            // Adiciona o alerta a lista de alertas encontrados
            found.alerts.push(alert[0].id)
            // Se for o último item, existir uma mensagem respondida e a quantidade palavras e alerta forem iguais, o alerta é referente a mensagem respondida
            if (i + 1 === foundNumber && message.hasQuotedMsg && message.words.length === found.alerts.length) {
                // Obtém a mensagem respondida
                message.quotedMsgObj = await message.getQuotedMessage()
                // Envia um alerta para a mensagem respondida
                found.message = message.quotedMsgObj
                found.message.text = found.message.body
                found.message.body = found.message.body.toLowerCase()
                found.message.chat = message.chat
                found.ignore.push(message.quotedMsgObj.author)
            }
            // Se não for uma resposta, o autor da mensagem for o mesmo da mensagem anterior e a quantidade palavras e alerta forem iguais, o alerta é referente a mensagem anterior
            else if (message.chat.lastMessage && message.words.length === found.alerts.length && message.author === message.chat.lastMessage.author) {
                // Envia um alerta para a penúltima mensagem
                found.message = message.chat.lastMessage
                found.message.text = found.message.body
                found.message.body = found.message.body.toLowerCase()
                found.message.chat = message.chat
            }
        }
    }

    return found
}