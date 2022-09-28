const ALERTS = require('../resources/alerts.json');

// Ações a ser realizadas após o bot ser adicionado em um grupo
async function processAddGroup(client, chat){
    let text = 'Olá pessoal do grupo *'+chat.name+'*, vou ajudar vocês a avisarem os demais participantes quando algo relevante acontecer, ' +
        'para isso basta enviar um dos alertas abaixo em uma mensagem ou responder uma mensagem com o alerta, quem ' +
        'desejar ser alertado pode entrar em contato comigo e ativar os alertas que mais te interessa!\n'
    text += '\nOs alertas disponíveis são:\n'

    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        text += '\n```'+ALERTS[i]+'```'
    }

    await client.sendText(chat.id, text)
}

module.exports = processAddGroup