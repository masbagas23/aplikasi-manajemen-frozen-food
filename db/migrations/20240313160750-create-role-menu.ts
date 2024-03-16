'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_menus', {
      roleId: {
        references: {
          model: "roles",
          key: "id"
        },
        type: Sequelize.INTEGER
      },
      menuId: {
        references: {
          model: "menus",
          key: "id"
        },
        type: Sequelize.INTEGER
      },
    });
  },
  // @ts-ignore
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleMenus');
  }
};