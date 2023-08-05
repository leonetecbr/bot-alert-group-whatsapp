'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AlertedAlerts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AlertId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Alert',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      AlertedId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Alerted',
          key: 'id',
          onDelete: 'CASCADE',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AlertedAlerts');
  }
};