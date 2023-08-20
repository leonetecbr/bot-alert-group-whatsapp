const {Alerted} = require('../models')

module.exports = async (client, messageDeleted, revokedMessage) => {
    const message = revokedMessage ?? messageDeleted

    if (message.id === undefined) return false

    const alerteds = await Alerted.findAll({
        where: {
            alertedMessageId: message.id._serialized,
        },
        raw: true,
        attributes: ['messageId'],
    })

    for (const alerted of alerteds) {
        client.getChatById(alerted.messageId.split('_')[1])
            .then(chat => {
                let limit = 20

                if (chat.isGroup) limit *= chat.participants.length

                chat.fetchMessages({limit})
                    .then(messages => {
                        messages.map((message) => {
                            if (message.id._serialized === alerted.messageId) {
                                message.delete(true)
                                    .then(() => console.log('|***** Mensagem deletada:  ', alerted.messageId, '*****|'))
                                    .catch(e => console.log(e))
                            }
                        })
                    })
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
        await alerted.destroy()
    }
}
