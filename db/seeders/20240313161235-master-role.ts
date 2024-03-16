'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // @ts-ignore
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('roles', [{
      code:'SPR-ADM',
      name:'Superadmin',
      description: 'Akun untuk pengatur website',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  // @ts-ignore
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('roles', null, {});

  }
};
