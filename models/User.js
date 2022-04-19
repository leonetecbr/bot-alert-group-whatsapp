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

for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
  table['a'+i] = {
    type: Sequelize.BOOLEAN,
    default: false
  }
}

const User = database.define('users', table)

module.exports = User