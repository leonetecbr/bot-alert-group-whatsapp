const {Model, DataTypes} = require('sequelize')

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return Model
 * */
module.exports = (sequelize, DataTypes) => {
  class AlertedAlert extends Model {}

  AlertedAlert.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    AlertId: DataTypes.INTEGER,
    AlertedId: DataTypes.STRING,
  }, {
    sequelize,
    updatedAt: false,
    modelName: 'AlertedAlert',
  })

  return AlertedAlert
}