const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const globalConstants = require('../const/globalConstants');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', 
    info: {
      title: 'Voting API', 
      version: '1.0.0',
      description: 'API Documentation for Voting System', 
    },
    servers: [
      {
        url: globalConstants.API_URL
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/**/*.js'), 
    path.join(__dirname, '../controllers/**/*.js')
  ]
};

// Generar la documentación de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
