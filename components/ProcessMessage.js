import fs from 'fs'
import findAlert from './FindAlert.js'
import chatBot from './ChatBot.js'
import User from '../models/User.js'
import Alert from '../models/Alert.js'
const adminFile = 'resources/admin.json'
const admin = (fs.existsSync(adminFile)) ? JSON.parse(fs.readFileSync(adminFile, 'utf8')) : []

// Processa mensagens recebidas em grupos e chats privados
export async function processMessage(client, message) {
    // Separa cada palavra em um elemento do array
    message.words = (message.text !== null) ? message.text.replace(/\n/g, ' ').toLowerCase().split(' ') : []

    // Em grupos, busca por alertas nas mensagens recebidas,
    if (message.chat.isGroup) await findAlert(message, client)
    // Evita que o bot responda empresas que eventualmente envie uma mensagem privada para o número
    else if (!message.sender.isEnterprise) {
        // Interage com o administrador quando ele envia um comando
        if (admin.includes(message.from) && message.text.startsWith('/') && message.words.length === 2) {
            const param = message.words[1]
            const command = message.words[0].replace('/', '')

            // Deletar usuário ou alerta
            if (command === 'del') {
                // Deletar o usuário
                if (param.endsWith('@c.us')) {
                    await User.sync()

                    const user = await User.findByPk(param)

                    if (user) {
                        await user.destroy()
                        await client.react(message.id, '✅')
                    } else await client.react(message.id, '❌')
                }
                // Deletar alerta
                else {
                    await Alert.sync()

                    const alert = await Alert.findOne({
                        where: {
                            name: param
                        }
                    })

                    if (alert) {
                        await alert.destroy()
                        await client.react(message.id, '✅')
                    } else await client.react(message.id, '❌')
                }
            }
            // Criar alerta
            else if (command === 'add') {
                await Alert.create({
                    name: param,
                })

                await client.react(message.id, '✅')
            }
            // Comando inválido
            else await client.sendText(message.from, 'Comando inválido')
        }
        // Interage com os usuários comuns
        else await client.reply(message.from, await chatBot(message), message.id, true)
    }
}

export default processMessage