const Sequelize = require('sequelize')
const database = require('../databases/db')
const ALERTS = require('../resources/alerts.json')

let table = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
}

// Cria os campos na tabela conforme a quantidade de alertas definidos
for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
    table['a'+i] = {
        type: Sequelize.BOOLEAN,
        default: false
    }
}

// Cria tabela se não existir
const User = database.define('users', table)

module.exports = User