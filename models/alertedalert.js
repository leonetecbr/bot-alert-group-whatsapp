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
        model: 'Alerts',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    AlertedId: {
      type: DataTypes.STRING,
      references: {
        model: 'Alerteds',
        key: 'messageId',
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