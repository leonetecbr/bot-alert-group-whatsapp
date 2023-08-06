const {Model, DataTypes} = require('sequelize');

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
    AlertId: {
      type: DataTypes.INTEGER,
      references: {
        modelName: 'Alert',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    AlertedId: {
      type: DataTypes.INTEGER,
      references: {
        modelName: 'Alerted',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
  }, {
    sequelize,
    updatedAt: false,
    modelName: 'AlertedAlert',
  });

  return AlertedAlert;
};