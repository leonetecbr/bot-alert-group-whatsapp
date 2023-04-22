import findAlert from './FindAlert.js'
import alertUsers from './AlertUsers.js'
import chatBot from './ChatBot.js'
import commandsAdmin from './CommandsAdmin.js'
import easterEggs from './EasterEggs.js'

// Processa mensagens recebidas em grupos e chats privados
export async function processMessage(client, message, alerts) {

    // Lista de administradores
    const admins = process.env.ADMINS.split(',')

    // Trata a mensagem recebida para evitar erros
    message.text = (message.text) ? message.text : ''

    // Armazena a mensagem original para ser usada na busca por links
    message.textNormal = message.text

    // Passa toda a mensagem para minúsculo
    message.text = message.text.toLowerCase()

    // Separa cada palavra em um elemento do array
    message.words = message.text.replace(/\n/g, ' ').split(' ')

    // Em grupos, busca por alertas nas mensagens recebidas,
    if (message.chat.isGroup) {
        let found = await findAlert(message, alerts)

        // Envia uma mensagem de resposta marcando os usuários com os alertas ativados
        if (found.alerts.length !== 0) await alertUsers(found, client)
        // Se não encontrar alerta, procura por easter eggs
        else if (found.alerts.length === 0 && message.mentionedJidList) await easterEggs(message, client, alerts)
        // Marca a mensagem como lida
        else await client.sendSeen(message.chatId)
    }
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    else if (!message.sender.isEnterprise) {
        // Inicia o "digitando ..."
        await client.simulateTyping(message.chatId, true)
        // Interage com o administrador quando ele envia um comando
        if (admins.includes(message.from) && message.text.startsWith('/') && message.words.length === 2) await commandsAdmin()
        // Interage com os usuários comuns
        else {
            try {
                await client.reply(message.from, await chatBot(message), message.id, true)
            } catch (e) {
                console.log(e)
            }
        }
        // Marca a mensagem como lida (reply não está funcionando)
        await client.sendSeen(message.chatId)
        // Para o "digitando ..."
        await client.simulateTyping(message.chatId, false)
    }
}

export default processMessage