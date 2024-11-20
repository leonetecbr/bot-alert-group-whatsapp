const {Model, DataTypes} = require('sequelize')

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return Model
 * */
module.exports = (sequelize, DataTypes) => {
  class Alert extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserAlert,
        foreignKey: 'AlertId',
        as: 'users',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })

      this.belongsToMany(models.Alerted, {
        through: models.AlertedAlert,
        foreignKey: 'AlertId',
        as: 'alerteds',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
    }
  }

  Alert.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Alert',
    createdAt: false,
  })

  return Alert
}