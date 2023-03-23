export async function EasterEggs(message, client){
    const me = (await client.getMe())['status']
// Responde a mensagens que o mencionam
    if (message.mentionedJidList.includes(me)) {
        // Inicia o "digitando ..."
        await client.simulateTyping(message.chatId, true)

        if (admins.includes(message.author) && message.text === '@' + me.split('@')[0] + ' conta a novidade aí') {
            const members = await client.getGroupMembersId(message.chatId)
            let text = 'A novidade é que agora os alertas podem ser enviados no privado, basta ativar a opção' +
                ' no menu de configurações na conversa comigo.\n\nE pra quem ainda não me conhece, sou o bot que' +
                ' te ajuda a não perder as melhores promoções. Para ser avisado também, me mande uma mensagem' +
                ' no privado.\n\nViu alguma promoção interessante? Envie uma das hashtags abaixo para que eu possa ' +
                'avisar os demais participantes do grupo:\n'

            // Remove o bot do array de membros
            members.splice(members.indexOf(me), 1)

            // Remove quem escreveu a mensagem do array de membros
            members.splice(members.indexOf(message.author), 1)

            // Lista os alertas disponíveis
            alerts.map(alert => text += '\n```#' + alert.name + '```')

            text += '\n\n'

            // Menciona todos os membros do grupo
            members.map(id => text += '@' + id.split('@')[0] + ' ')

            const messageId = await client.sendReplyWithMentions(message.chatId, text, message.id, false, members)

            // Se falhar, envia a mensagem sem ser como resposta
            if (!messageId || !messageId.startsWith('true_')) await client.sendTextWithMentions(message.chatId, text, false, members)
        } else await client.reply(message.chatId, 'Opa, me chamou? 👀', message.id, true)

        // Para o "digitando ..."
        await client.simulateTyping(message.chatId, false)
    }
}

export default EasterEggs