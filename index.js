'use strict';

const qrcode = require('qrcode-terminal')
const {Client, LocalAuth,} = require('whatsapp-web.js')
const dotenv = require('dotenv')

dotenv.config()

const ALERTS = process.env.ALERTS.split(',')

async function start() {
    const client = new Client({
        authStrategy: new LocalAuth(),
    })

    client.on('qr', qr => qrcode.generate(qr, {small: true}))

    client.on('authenticated', session => console.log('Autenticado com sucesso!'));

    client.on('ready', () => console.log('Iniciado com sucesso!'))

    client.on('message', message => {
        if (message.body === '!ping') {
            message.reply('pong')
        }
    })

    client.on('message_revoke_everyone', message => {
        console.log(message)
    })

    client.on('disconnected', reason => console.log("WHATSAPP DESCONECTADO!!!", reason))

    await client.initialize()
}

start()