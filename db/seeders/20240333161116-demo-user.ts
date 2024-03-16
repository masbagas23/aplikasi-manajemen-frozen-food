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
    return queryInterface.bulkInsert('users', [{
      fullName: 'Super Admin',
      email: 'superadmin@test.com',
      password: '$2a$10$Z30A1.u1GsclKx0YrYfmuekZc0Dmn.6qbjVvO8S.hhN1ejQfdMJni',
      avaUrl: '/img/banner-1.jpg',
      roleId: 1,
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
    return queryInterface.bulkDelete('users', null, {});
  }
};
