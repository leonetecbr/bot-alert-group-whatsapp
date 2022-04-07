const Sequelize = require('sequelize')
const database = require('../databases/db')

const User = database.define('users', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  a1: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a2: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a3: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a4: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a5: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a6: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a7:{
    type: Sequelize.BOOLEAN,
    default: false
  },
  a8: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a9: {
    type: Sequelize.BOOLEAN,
    default: false
  },
  a10: {
    type: Sequelize.BOOLEAN,
    default: false
  }

})

module.exports = User