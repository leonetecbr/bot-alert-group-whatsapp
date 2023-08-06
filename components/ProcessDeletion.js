const {Alerted} = require('../models')

module.exports = async (client, messageDeleted, revokedMessage) => {
    const message = revokedMessage ?? messageDeleted

    if (message.from === undefined) return false

    const alerted = await Alerted.findAll({
        where: {
            alertedMessageId: message.id,
        },
        raw: true,
        attributes: ['messageId'],
    })

    alerted.map(async alert => {
        // TODO: Delete message alert.messageId
        console.log('|***** Mensagem deletada:  ', alert.messageId, '*****|')
        await alert.destroy()
    })
}
