const {Alerted} = require('../models')

module.exports = async (client, messageDeleted, revokedMessage) => {
    const message = revokedMessage ?? messageDeleted

    if (message.from === undefined) return false

    const alerteds = await Alerted.findAll({
        where: {
            alertedMessageId: message.id._serialized,
        },
        raw: true,
        attributes: ['messageId'],
    })

    for (const alerted of alerteds) {
        // TODO: Delete message alerted.messageId
        console.log('|***** Mensagem deletada:  ', alerted.messageId, '*****|')
        await alerted.destroy()
    }
}
