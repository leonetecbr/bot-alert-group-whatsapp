export async function processCall(client, call) {
    await client.sendText(call.peerJid, 'Este é um sistema automatizado que não aceita ligações!')
}

export default processCall