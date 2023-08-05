'use strict';

const {Model} = require('sequelize');

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
        model: 'Alert',
        key: 'id',
        onDelete: 'CASCADE',
      },
    },
    AlertedId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Alerted',
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