'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore Parameter 'queryInterface' implicitly has an 'any' type
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        unique: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // @ts-ignore Parameter 'queryInterface' implicitly has an 'any' type
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};