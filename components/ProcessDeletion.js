const Alerted = require('../models/Alerted')

async function processDeletion(client, messageDeleted) {
    if (messageDeleted.from === undefined) return false

    await Alerted.sync()

    const messages = await Alerted.findAll({
        where: {
            alertedMessageId: messageDeleted.id
        }
    })

    messages.map(async message => {
        await client.deleteMessage(messageDeleted.from, message.messageId)
        await message.destroy()
    })
}

module.exports = processDeletion