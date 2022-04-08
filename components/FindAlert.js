const ALERTS = require('../resources/alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let alerted = false
    for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
        if (message.text.toLowerCase().search(ALERTS[i]) !== -1) {
            await alertUsers(message, i, client)
            alerted = true
        }
    }
    return alerted
}

module.exports = FindAlert