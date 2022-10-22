const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')
const ALERTS = require('../resources/alerts.json')

class User extends Model {}

let table = {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}

// Cria os campos na tabela conforme a quantidade de alertas definidos
for (let i = 1; typeof ALERTS[i] !== 'undefined'; i++) {
    table['a'+i] = {
        type: DataTypes.BOOLEAN,
        default: false
    }
}

User.init(table, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
})

module.exports = User