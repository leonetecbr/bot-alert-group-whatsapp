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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    AlertId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Alert',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
  }, {
    sequelize,
    modelName: 'UserAlert',
    updatedAt: false,
  });

  return UserAlert;
};