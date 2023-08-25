module.exports = async (client, call) => {
    const chat = await client.getChatById(call.peerJid)

    // Inicia o "digitando ..."
    chat.sendStateTyping().catch(e => console.log(e))
    // Rejeita a chamada
    call.reject().catch(e => console.log(e))
    // Envia aviso ao usuário
    chat.sendMessage('Este é um sistema automatizado que não aceita ligações!').catch(e => console.log(e))
    // Para o "digitando ..."
    chat.clearState().catch(e => console.log(e))
}