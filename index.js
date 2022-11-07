const {create} = require('@open-wa/wa-automate')
const processMessage = require('./components/ProcessMessage')
const processAddGroup = require('./components/ProcessAddGroup')
const processDeletion = require('./components/ProcessDeletion')
const sequelize = require('./databases/db')
const Alert = require('./models/Alert')
const ALERTS = require('./resources/alerts.json')

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