'use strict';

var faker = require('faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var gallery = [];
    for (var i=0; i < 10; i++) {
      gallery.push({
        author: faker.name.firstName(),
        link: faker.image.image(),
        description: "this is a " + faker.lorem.words(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
                                    //GALLERIES is your table 
    return queryInterface.bulkInsert('Galleries', gallery, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Galleries', null, {});
  }
};

