const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')

class User extends Model {}

let table = {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}

User.init(table, {
    sequelize,
    updatedAt: false,
})

module.exports = User