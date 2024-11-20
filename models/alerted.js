const {Model, DataTypes} = require('sequelize')

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return Model
 * */
module.exports = (sequelize, DataTypes) => {
  class Alerted extends Model {
    static associate(models) {
      this.belongsToMany(models.Alert, {
        through: models.AlertedAlert,
        foreignKey: 'AlertedId',
        as: 'alerts',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
    }
  }

  Alerted.init({
    messageId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      autoIncrement: false,
    },
    alertedMessageId: DataTypes.STRING,
  }, {
    sequelize,
    updatedAt: false,
    modelName: 'Alerted',
  })

  return Alerted
}