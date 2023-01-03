import Alerted from '../models/Alerted.js'

export async function alertGroup(found, client, users, text) {
    const message = found.message
    console.log('Membros com o(s) alerta(s) ativo(s): ', users)

    // Monta o texto da mensagem
    users.map(id => text += '@' + id.split('@')[0] + ' ')

    // Envia a resposta para o grupo com as menções
    let messageId = await client.sendReplyWithMentions(message.chatId, text, message.id, false, users)

    console.log('Texto enviado: ', text)

    // Se não tiver sido enviada com sucesso, tenta enviar novamente
    if (!messageId || !messageId.startsWith('true_')) messageId = await client.sendTextWithMentions(message.chatId, text, false, users)

    console.log('Id da mensagem: ', messageId)
    console.log('Id da mensagem respondida: ', message.id)

    // Para o "digitando ..."
    await client.simulateTyping(found.message.chatId, false)

    // Se tiver sido enviada com sucesso
    if (messageId && messageId.startsWith('true_')) {
        // Envia uma reação para a mensagem original
        await client.react(message.id, '✅')

        // Salva o ‘id’ da mensagem no banco de dados
        await Alerted.create({
            messageId,
            alertedMessageId: message.id
        })
    }
}

export default alertGroup