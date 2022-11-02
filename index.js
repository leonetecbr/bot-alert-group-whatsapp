const {create} = require('@open-wa/wa-automate')
const processMessage = require('./components/ProcessMessage')
const processAddGroup = require('./components/ProcessAddGroup')
const sequelize = require('./databases/db')
const Alert = require('./models/Alert')
const ALERTS = require('./resources/alerts.json')

create({
    useChrome: true,
    cacheEnabled: true,
    disableSpins: true,
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
    await client.onMessageDeleted(message => console.log(message))// TODO: Deletar a mensagem que marca os usuários

    client.onStateChanged(state => {
        console.log('Mudou de estado:', state)

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        if (state === 'UNPAIRED') console.log('Desconectado do Whatsapp!!!')
    })
}