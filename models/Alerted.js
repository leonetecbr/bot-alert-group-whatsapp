const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')

class Alerted extends Model {}

Alerted.init({
    messageId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    alertedMessageId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    updatedAt: false
})

module.exports = Alerted