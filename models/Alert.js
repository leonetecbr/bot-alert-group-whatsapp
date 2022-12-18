import {DataTypes, Model} from 'sequelize'
import sequelize from '../databases/db.js'

export class Alert extends Model {
}

Alert.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    createdAt: false,
})

export default Alert