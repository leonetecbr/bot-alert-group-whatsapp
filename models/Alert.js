const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')

class Alert extends Model {}

Alert.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    createdAt: false
})

module.exports = Alert