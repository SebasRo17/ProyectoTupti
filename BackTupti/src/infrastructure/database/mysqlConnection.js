const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tupti_db', 'tupti_user', 'Proyectodb1@', {
  host: '46.202.93.12',
  dialect: 'mysql',
  logging: false,
  port: 3308
});


module.exports = { sequelize };