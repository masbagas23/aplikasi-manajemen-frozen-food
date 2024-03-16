'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore Parameter 'queryInterface' implicitly has an 'any' type
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      avaUrl: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id"
        },
        onDelete: "CASCADE"
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
    await queryInterface.dropTable('Users');
  }
};