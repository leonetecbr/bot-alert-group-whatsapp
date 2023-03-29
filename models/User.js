import {DataTypes, Model} from 'sequelize'
import sequelize from '../databases/db.js'
import {readFile} from 'fs/promises'

const states = JSON.parse(await readFile('./resources/UFs.json', 'utf8'))

export class User extends Model {
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    privateAlerts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    state: {
        type: DataTypes.ENUM,
        values: states,
        allowNull: true,
    },
    capital: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    createdAt: false,
})

export default User