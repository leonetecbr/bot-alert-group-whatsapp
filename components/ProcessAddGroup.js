const Alert = require('../models/Alert')

// Ações a ser realizadas após o bot ser adicionado em um grupo
async function processAddGroup(client, chat){
    const alerts = await Alert.findAll()
    let text = 'Olá pessoal do grupo *'+chat.name+'*, vou ajudar vocês a avisarem os demais participantes quando algo relevante acontecer, ' +
        'para isso basta enviar um dos alertas abaixo em uma mensagem ou responder uma mensagem com o alerta, quem ' +
        'desejar ser alertado pode entrar em contato comigo e ativar os alertas que mais te interessa!\n'
    text += '\nOs alertas disponíveis são:\n'

    alerts.map(alert => text += '\n```#' + alert.name + '```')

    await client.sendText(chat.id, text)
}

module.exports = processAddGroup