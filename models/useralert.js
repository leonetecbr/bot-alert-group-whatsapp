const {Model, DataTypes} = require('sequelize')

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @return Model
 * */
module.exports = (sequelize, DataTypes) => {
  class UserAlert extends Model {}

  UserAlert.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    AlertId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserAlert',
    updatedAt: false,
  })

  return UserAlert
}