// Ações a ser realizadas após o bot ser adicionado em um grupo
export async function processAddGroup(client, chat, alerts) {
    const members = await client.getGroupMembersId(chat.id)
    let text = 'Olá pessoal do grupo *' + chat.name + '*, vou ajudar vocês a avisarem os demais participantes quando algo relevante acontecer, ' +
        'para isso basta enviar um dos alertas abaixo em uma mensagem ou responder uma mensagem com o alerta, quem ' +
        'desejar ser alertado pode entrar em contato comigo e ativar os alertas que mais te interessa!\n' +
        '\nOs alertas disponíveis são:\n'

    // Lista os alertas disponíveis
    alerts.map(alert => text += '\n```#' + alert.name + '```')

    text += '\n\n'

    // Menciona todos os membros do grupo
    members.map(id => text += '@' + id.split('@')[0] + ' ')

    await client.sendTextWithMentions(chat.id, text, false, members)
}

export default processAddGroup