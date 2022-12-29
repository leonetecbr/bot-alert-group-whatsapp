import Alerted from '../models/Alerted.js'

export async function processDeletion(client, messageDeleted) {
    if (messageDeleted.from === undefined) return false

    await Alerted.sync()

    const messages = await Alerted.findAll({
        where: {
            alertedMessageId: messageDeleted.id
        },
        attributes: ['messageId'],
    })

    messages.map(async message => {
        await client.deleteMessage(messageDeleted.from, message.messageId)
        console.log('|***** Mensagem deletada:  ', message.messageId, '*****|')
        await message.destroy()
    })
}

export default processDeletion