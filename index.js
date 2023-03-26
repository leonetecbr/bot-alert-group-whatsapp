import dotenv from 'dotenv'
import PQueue from 'p-queue'
import {create} from '@open-wa/wa-automate'
import processMessage from './components/ProcessMessage.js'
import processAddGroup from './components/ProcessAddGroup.js'
import processDeletion from './components/ProcessDeletion.js'
import processCall from './components/ProcessCall.js'
import sequelize from './databases/db.js'
import Alert from './models/Alert.js'

dotenv.config()

const queue = new PQueue({
    concurrency: 4,
    autoStart: false,
})
const ALERTS = process.env.ALERTS.split(',')

create({
    useChrome: true,
    cacheEnabled: true,
    cachedPatch: true,
    disableSpins: true,
    killClientOnLogout: true,
    killProcessOnTimeout: true,
    logConsoleErrors: true,
    hostNotificationLang: 'pt-br',
    aggressiveGarbageCollection: true,
    ensureHeadfulIntegrity: true,
    restartOnCrash: start,
}).then(start)

async function start(client) {
    await sequelize.sync()

    const alerts = await Alert.findAll({
        attributes: ['id', 'name'],
        raw: true,
    })

    let lastMessage = null

    // Verifica se os alertas estão no banco de dados
    if (alerts.length === 0) {
        ALERTS.map(async alert => {
            await Alert.create({
                name: alert
            })
        })
    }

    // Mensagem recebida
    await client.onMessage(message => {
        message.lastMessage = lastMessage
        queue.add(() => processMessage(client, message, alerts))
        lastMessage = message
    })
    // Foi adicionado em um grupo
    await client.onAddedToGroup(chat => processAddGroup(client, chat, alerts))
    // Mensagem deletada
    await client.onMessageDeleted(message => queue.add(() => processDeletion(client, message)))
    // Chamada recebida
    await client.onIncomingCall(call => processCall(client, call))
    // Processa as mensagens não lidas
    await client.emitUnreadMessages()

    // Estado mudou, tenta reconectar
    client.onStateChanged(state => {
        console.log('Mudou de estado:', state)

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        if (state === 'UNPAIRED') console.log('Desconectado do Whatsapp!!!')
    })

    // Inicia o fila de execução
    queue.start()
}