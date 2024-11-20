const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BackTupti',
      version: '1.0.0',
    },
  },
  apis: ['./src/presentation/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi: swaggerUi.serve,
  swaggerSpec
};