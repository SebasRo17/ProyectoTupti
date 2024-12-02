const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tupti_dev', 'root', 'example', {
  host: '26.69.93.18',
  dialect: 'mysql',
  logging: false,
  port: 3308
});

module.exports = { sequelize };