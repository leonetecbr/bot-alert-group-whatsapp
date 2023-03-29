import {DataTypes, Model} from 'sequelize'
import sequelize from '../databases/db.js'

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
        values: [
            'AC',
            'AL',
            'AP',
            'AM',
            'BA',
            'CE',
            'DF',
            'ES',
            'GO',
            'MA',
            'MT',
            'MS',
            'MG',
            'PA',
            'PB',
            'PR',
            'PE',
            'PI',
            'RJ',
            'RN',
            'RS',
            'RO',
            'RR',
            'SC',
            'SP',
            'SE',
            'TO'
        ],
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