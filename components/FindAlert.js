const ALERTS = require('../resources/alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let alerted = false
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        if (message.text.toLowerCase().search(ALERTS[i]) !== -1) {
            if (message.text.length === ALERTS[i].length && message.quotedMsgObj !== null && message.quotedMsgObj.text !== ''){
                await alertUsers(message.quotedMsgObj, i, client)
            } else await alertUsers(message, i, client)
            alerted = true
        }
    }
    return alerted
}

module.exports = FindAlert