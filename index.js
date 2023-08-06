'use strict';

const qrcode = require('qrcode-terminal')
const {Client, LocalAuth,} = require('whatsapp-web.js')
const dotenv = require('dotenv')
const processMessage = require('./components/ProcessMessage')

dotenv.config()

async function start() {
    console.log('Iniciando ...')

    const client = new Client({
        authStrategy: new LocalAuth(),
    })
    let lastMessage = null

    client.on('qr', qr => qrcode.generate(qr, {small: true}))

    client.on('authenticated', session => console.log('Autenticado com sucesso!'));

    client.on('ready', () => console.log('Iniciado com sucesso!'))

    client.on('message', async message => {
        message.lastMessage = lastMessage
        lastMessage = await processMessage(client, message)
    })

    client.on('message_revoke_everyone', message => {
        console.log(message)
    })

    client.on('disconnected', reason => console.log("WHATSAPP DESCONECTADO!!!", reason))

    await client.initialize()
}

start()