import Sequelize from 'sequelize'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
})

export default sequelize