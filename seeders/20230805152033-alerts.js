'use strict'

const {Op} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Alerts', [
      {
        name: 'bug',
        updatedAt: new Date(),
      },
      {
        name: 'ifood',
        updatedAt: new Date(),
      },
      {
        name: 'picpay',
        updatedAt: new Date(),
      },
      {
        name: 'shopee',
        updatedAt: new Date(),
      },
      {
        name: 'mercadolivre',
        updatedAt: new Date(),
      },
      {
        name: 'gratis',
        updatedAt: new Date(),
      },
      {
        name: 'cupom',
        updatedAt: new Date(),
      },
      {
        name: 'promoboa',
        updatedAt: new Date(),
      },
      {
        name: 'mercadopago',
        updatedAt: new Date(),
      },
      {
        name: 'ccame',
        updatedAt: new Date(),
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alerts', {
      name: {
        [Op.or]: ['bug', 'ifood', 'picpay', 'shopee', 'mercadolivre', 'gratis', 'cupom', 'promoboa', 'mercadopago', 'ccame'],
      },
    }, {})
  }
}
