'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.bulkInsert('Users', [{
    username: 'Teotran',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
   }]);

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
