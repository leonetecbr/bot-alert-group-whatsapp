import {DataTypes, Model} from 'sequelize'
import sequelize from '../databases/db.js'

export class User extends Model {
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
    sequelize,
    updatedAt: false,
})

export default User