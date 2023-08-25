/**
 * Busca por mensagens que disparam easter eggs
 *
 * @return {Promise<void>}
 */
module.exports = async (me, message, alerts) => {
    const admins = process.env.ADMINS.split(',')
    const chat = message.chat

    // Responde a mensagens que o mencionam
    if (message.mentionedIds.includes(me._serialized)) {
        // Inicia o "digitando ..."
        chat.sendStateTyping().catch(e => console.log(e))

        if (admins.includes(message.author) && message.body === '@' + me.user + ' conta a novidade aí') {
            let text = 'A novidade é que agora os alertas podem ser enviados no privado, basta ativar a opção' +
                ' no menu de configurações na conversa comigo.\n\nE pra quem ainda não me conhece, sou o bot que' +
                ' te ajuda a não perder as melhores promoções. Para ser avisado também, me mande uma mensagem' +
                ' no privado.\n\nViu alguma promoção interessante? Envie uma das hashtags abaixo para que eu possa ' +
                'avisar os demais participantes do grupo:\n'
            let mentions = []


            // Lista os alertas disponíveis
            for (const alert of alerts) {
                text += '\n```#' + alert.name + '```'
            }

            text += '\n\n'

            // Menciona todos os participantes do grupo
            for (const member of chat.participants) {
                // Remove o bot e o autor do array de menções
                if (member.id._serialized !== me._serialized && member.id._serialized !== message.author){
                    mentions.push(member.id._serialized)
                    text += `@${member.id.user} `
                }
            }

            // Tenta enviar como resposta, em caso de falha envia com mensagem normal
            chat.sendMessage(text, {mentions, quotedMessageId: message.id._serialized}).catch(e => {
                console.log(e)
                chat.sendMessage(text, {mentions}).catch(e => console.log(e))
            })

            // Marca a mensagem como lida
            chat.sendSeen().catch(e => console.log(e))
        } else {
            message.reply('Opa, me chamou? 👀').catch(e => console.log(e))
        }

        // Para o "digitando ..."
        chat.clearState().catch(e => console.log(e))
    }
}