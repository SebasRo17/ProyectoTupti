const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('railway', 'root', 'zifyAQJewIINYVVJTAQXcnQfFWHBEbLo', {
  host: 'autorack.proxy.rlwy.net',
  dialect: 'mysql',
  logging: false,
  port: 53886
});

module.exports = { sequelize };