const {Alert} = require('../models')

module.exports = async (client, notification) => {
    const me = client.info.wid._serialized

    // Se for o bot que entrou no grupo
    if (notification.recipientIds.includes(me)) {
        const chat = await client.getChatById(notification.chatId)
        const alerts = await Alert.findAll()

        let text = 'Olá pessoal do grupo *' + chat.name + '*, vou ajudar vocês a avisarem os demais participantes quando algo relevante acontecer, ' +
            'para isso basta enviar um dos alertas abaixo em uma mensagem ou responder uma mensagem com o alerta, quem ' +
            'desejar ser alertado pode entrar em contato comigo e ativar os alertas que mais te interessa!\n' +
            '\nOs alertas disponíveis são:\n'

        // Lista os alertas disponíveis
        for (const alert of alerts) {
            text += '\n```#' + alert.name + '```'
        }

        text += '\n\n'

        let mentions = []

        // Menciona todos os membros do grupo
        for (const member of chat.participants) {
            if (member.id._serialized !== me) {
                const user = await client.getContactById(member.id._serialized)

                text += '@' + user.id.user + ' '
                mentions.push(user)
            }
        }

        chat.sendMessage(text, {mentions}).catch(e => console.log(e))
    }
}
