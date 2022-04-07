const ALERTS = require('../alerts.json')
const alertUsers = require('./AlertUsers')

async function FindAlert(message, client) {
    let alerted = false
    for (let i = 1; i <= 10; i++) {
        if (message.text.search(ALERTS[i]) !== -1) {
            await alertUsers(message, i, client)
            alerted = true
        }
    }
    return alerted
}

module.exports = FindAlert