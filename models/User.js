const { DataTypes, Model } = require('sequelize')
const sequelize = require('../databases/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
    sequelize,
    updatedAt: false,
})

module.exports = User