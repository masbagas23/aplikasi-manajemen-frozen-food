'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      parentId: {
        references: {
          model: "menus",
          key: "id"
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER
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
  // @ts-ignore
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Menus');
  }
};