import {DataTypes, Model} from 'sequelize'
import sequelize from '../databases/db.js'

export class Alerted extends Model {}

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

export default Alerted