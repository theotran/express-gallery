//this is how you access the table 

'use strict';
module.exports = function(sequelize, DataTypes) {
  //Gallery is just how you refer to the model in express
  var Gallery = sequelize.define('Gallery', {
    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Gallery;
};