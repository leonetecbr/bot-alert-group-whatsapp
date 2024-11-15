'use strict'

const dotenv = require('dotenv')

dotenv.config({
    path: `${__dirname}/.env`
})

const qrcode = require('qrcode-terminal')
const {Client, LocalAuth} = require('whatsapp-web.js')
const processMessage = require('./components/ProcessMessage')
const processCall = require('./components/ProcessCall')
const processDeletion = require('./components/ProcessDeletion')
const processAddGroup = require('./components/ProcessAddGroup')

async function start() {
    try {
        console.log('Iniciando ...')

        const client = new Client({
            webVersionCache: {
                type: 'local',
                path: `${__dirname}/.wwebjs_cache/`,
            },
            authStrategy: new LocalAuth({dataPath: `${__dirname}/.wwebjs_auth/`}),
            restartOnAuthFail: true,
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ],
            },
        })
        let lastMessage = []
        let lastState = null

        // Pronto para mostrar o QR Code
        client.on('qr', qr => {
            console.log('Escanei o QR Code:')
            qrcode.generate(qr, {small: true})
        })

        // Autenticado
        client.on('authenticated', () => console.log('Autenticado com sucesso!'))

        // WhatsApp conectado
        client.on('ready', () => {
            console.log('Iniciado com sucesso!')
            // Reinicia o robô todos os dias para evitar bugs
            setTimeout(() => {
                client.destroy()
                    .then(() => {
                        start().then((e) => e ? console.log(e) : '')
                        throw 'Refresh: Encerrando função anterior e iniciando novamente';
                    })
                    .catch(e => console.log(e))
            }, 24 * 60 * 60 * 1000)
        })

        // Mensagem recebida
        client.on('message', async message => {
            message.lastMessage = lastMessage[message.id.remote] ?? null
            lastMessage[message.id.remote ?? 0] = await processMessage(client, message)
        })

        // Mensagem deletada para todos
        client.on('message_revoke_everyone', async (message, revoked_msg) => await processDeletion(client, message, revoked_msg))

        // Chamada recebida
        client.on('incoming_call', async call => await processCall(client, call))

        // Estado mudou
        client.on('change_state', state => {
            console.log('Mudou de estado:', state)

            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.resetState()

            if (state === 'OPENING' || state === 'PAIRING') {
                setTimeout(() => {
                    if (state === lastState) {
                        client.destroy()
                            .then(() => {
                                start().then((e) => e ? console.log(e) : '')
                                throw 'Timeout: Encerrando função anterior e iniciando novamente';
                            })
                            .catch(e => console.log(e))
                    }
                }, 5 * 60 * 1000)
            }
        })

        // Foi adicionado em um grupo
        client.on('group_join', notification => processAddGroup(client, notification))

        // Desconectado
        client.on('disconnected', () => {
            throw 'Desconectado do Whatsapp!!!'
        })

        await client.initialize()
    } catch (e) {
        return e;
    }
}

start().then((e) => e ? console.log(e) : '')