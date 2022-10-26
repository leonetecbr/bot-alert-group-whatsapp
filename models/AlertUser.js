const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')
const User = require('./User')
const Alert = require('./Alert')

class AlertUser extends Model {}

AlertUser.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    AlertId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alert,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
}, {
    sequelize,
    updatedAt: false,
})

User.hasMany(AlertUser, {onDelete: 'cascade'})
Alert.hasMany(AlertUser, {onDelete: 'cascade'})

module.exports = AlertUser