import fs from 'fs'
import findAlert from './FindAlert.js'
import chatBot from './ChatBot.js'
import commandsAdmin from './CommandsAdmin.js'
import {cli} from "@open-wa/wa-automate/dist/cli/setup.js";

const adminFile = 'resources/admin.json'
const admin = (fs.existsSync(adminFile)) ? JSON.parse(fs.readFileSync(adminFile, 'utf8')) : []

// Processa mensagens recebidas em grupos e chats privados
export async function processMessage(client, message, alerts) {
    // Separa cada palavra em um elemento do array
    message.words = (message.text !== null) ? message.text.replace(/\n/g, ' ').toLowerCase().split(' ') : []

    // Em grupos, busca por alertas nas mensagens recebidas,
    if (message.chat.isGroup) {
        // Se não encontrar alerta, procura por easter eggs
        if (!await findAlert(message, client, alerts)){
            const me = (await client.getMe())['status']
            // Reage a mensagens que o mencionam
            if (message.mentionedJidList.includes(me)) await client.react(message.id, '👀')
        }
    }
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    else if (!message.sender.isEnterprise) {
        // Inicia o "digitando ..."
        await client.simulateTyping(message.chatId, true)
        // Interage com o administrador quando ele envia um comando
        if (admin.includes(message.from) && message.text.startsWith('/') && message.words.length === 2) await commandsAdmin()        // Interage com os usuários comuns
        else await client.reply(message.from, await chatBot(message), message.id, true)
        // Marca a mensagem como lida (reply não está funcionando)
        await client.sendSeen(message.chatId)
        // Para o "digitando ..."
        await client.simulateTyping(message.chatId, false)
    }
}

export default processMessage