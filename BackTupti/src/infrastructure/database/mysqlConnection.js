const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tupti_dev', 'root', 'example', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = { sequelize };