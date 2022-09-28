const {create} = require('@open-wa/wa-automate');
const processMessage = require('./components/ProcessMessage');
const processAddGroup = require('./components/ProcessAddGroup');

create().then(client => start(client));

async function start(client) {
    await client.onMessage(message => processMessage(client, message))
    await client.onAddedToGroup(chat => processAddGroup(client, chat))

    client.onStateChanged(state => {
        console.log('Mudou de estado:', state)

        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus();
        if (state === 'UNPAIRED') console.log('Desconectado do Whatsapp!!!')
    });
}