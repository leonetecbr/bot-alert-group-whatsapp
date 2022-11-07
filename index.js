import fs from 'fs'
import {create} from '@open-wa/wa-automate'
import processMessage from './components/ProcessMessage.js'
import processAddGroup from './components/ProcessAddGroup.js'
import processDeletion from './components/ProcessDeletion.js'
import sequelize from './databases/db.js'
import Alert from './models/Alert.js'
const ALERTS = JSON.parse(fs.readFileSync('resources/alerts.json', 'utf8'))

create({
    useChrome: true,
    cacheEnabled: true,
    disableSpins: true,
    killProcessOnBrowserClose: true,
    killClientOnLogout: true,
    killProcessOnTimeout: true,
    logConsoleErrors: true,
    restartOnCrash: start,
}).then(start)

async function start(client) {
    await sequelize.sync()

    const alerts = await Alert.findAll()
    if (alerts.length === 0) {
        ALERTS.map(async alert => {
            await Alert.create({
                name: alert
            })
        })
    }

    await client.onMessage(message => processMessage(client, message))
    await client.onAddedToGroup(chat => processAddGroup(client, chat))
    await client.onMessageDeleted(message => processDeletion(client, message))

    client.onStateChanged(state => {
        console.log('Mudou de estado:', state)

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        if (state === 'UNPAIRED') console.log('Desconectado do Whatsapp!!!')
    })
}