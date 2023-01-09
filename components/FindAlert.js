import alertUsers from './AlertUsers.js'

export async function FindAlert(message, client, alerts) {
    let found = {
        message: message,
        alerts: [],
        ignore: [message.author,],
    }

    const matches = message.text.match(/#\w+/g)

    // Verifica se tem possíveis alertas na mensagem
    if (matches === null) {
        await client.sendSeen(message.from)
        return false
    }

    matches.map((match, i, macthes) => {
        // Retira a # do inicio do alerta
        match = match.substring(1)

        // Verifica se o alerta existe
        const alert = alerts.filter(alert => alert.name === match)

        if (alert.length > 0) {
            // Adiciona o alerta a lista de alertas encontrados
            found.alerts.push(alert[0].id)
            // Se for o último item, existir uma mensagem respondida e a quantidade palavras e alertas forem iguais, ela é uma resposta
            if (i + 1 === macthes.length && message.quotedMsgObj !== null && message.words.length === found.alerts.length) {
                // O alerta é uma resposta a outra mensagem, sendo assim envia um alerta para a mensagem respondida
                found.message = message.quotedMsgObj
                found.message.textNormal = message.quotedMsgObj.text
                found.ignore.push(message.quotedMsgObj.author)
            }
        }
    })

    // Envia uma mensagem de resposta marcando os usuários com os alertas ativados
    if (found.alerts.length !== 0) {
        await alertUsers(found, client)
        return true
    }
    // Marca a mensagem como lida
    await client.sendSeen(message.from)
    return false
}

export default FindAlert