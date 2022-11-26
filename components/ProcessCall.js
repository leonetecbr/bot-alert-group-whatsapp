export async function processCall(client, call) {
    // Inicia o "digitando ..."
    await client.simulateTyping(call.peerJid, true)
    await client.sendText(call.peerJid, 'Este é um sistema automatizado que não aceita ligações!')
    // Para o "digitando ..."
    await client.simulateTyping(call.peerJid, false)
}

export default processCall