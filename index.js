'use strict'

const dotenv = require('dotenv')

dotenv.config()

const qrcode = require('qrcode-terminal')
const {Client, LocalAuth,} = require('whatsapp-web.js')
const processMessage = require('./components/ProcessMessage')
const processCall = require('./components/ProcessCall')
const processDeletion = require('./components/ProcessDeletion')
const processAddGroup = require('./components/ProcessAddGroup')

async function start() {
    console.log('Iniciando ...')

    const client = new Client({
        authStrategy: new LocalAuth(),
    })
    let lastMessage = null

    // Pronto para mostrar o QR Code
    client.on('qr', qr => {
        console.log('Escanei o QR Code:')
        qrcode.generate(qr, {small: true})
    })

    // Autenticado
    client.on('authenticated', session => console.log('Autenticado com sucesso!'))

    // WhatsApp conectado
    client.on('ready', () => console.log('Iniciado com sucesso!'))

    // Mensagem recebida
    client.on('message', async message => {
        message.lastMessage = lastMessage
        lastMessage = await processMessage(client, message)
    })

    // Mensagem deletada para todos
    client.on('message_revoke_everyone', async (message, revoked_msg) => await processDeletion(client, message, revoked_msg))

    // Chamada recebida
    client.on('incoming_call', async call => await processCall(client, call))

    // Estado mudou
    client.on('change_state', state => {
        console.log('Mudou de estado:', state)

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.resetState()
    })

    // Foi adicionado em um grupo
    client.on('group_join', notification => processAddGroup(client, notification))

    // Desconectado
    client.on('disconnected', e => console.log('Desconectado do Whatsapp!!!', e))

    await client.initialize()
}

start()