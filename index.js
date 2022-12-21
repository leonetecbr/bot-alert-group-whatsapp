import fs from 'fs'
import {create} from '@open-wa/wa-automate'
import PQueue from 'p-queue'
import processMessage from './components/ProcessMessage.js'
import processAddGroup from './components/ProcessAddGroup.js'
import processDeletion from './components/ProcessDeletion.js'
import processCall from './components/ProcessCall.js'
import sequelize from './databases/db.js'
import Alert from './models/Alert.js'

const queue = new PQueue({
    concurrency: 4,
    autoStart: false,
})
const ALERTS = JSON.parse(fs.readFileSync('resources/alerts.json', 'utf8'))

create({
    useChrome: true,
    cacheEnabled: true,
    cachedPatch: true,
    disableSpins: true,
    killClientOnLogout: true,
    killProcessOnTimeout: true,
    logConsoleErrors: true,
    restartOnCrash: start,
}).then(start)

async function start(client) {
    await sequelize.sync()

    const alerts = await Alert.findAll({
        attributes: ['id', 'name'],
        raw: true,
    })

    // Verifica se os alertas estão no banco de dados
    if (alerts.length === 0) {
        ALERTS.map(async alert => {
            await Alert.create({
                name: alert
            })
        })
    }

    // Mensagem recebida
    await client.onMessage(message => queue.add(() => processMessage(client, message, alerts)))
    // Foi adicionado em um grupo
    await client.onAddedToGroup(chat => processAddGroup(client, chat))
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

    // Atualiza a página para evitar que o navegador fique travado
    setInterval(() => client.refresh(), 1000 * 60 * 60 * 3)
}