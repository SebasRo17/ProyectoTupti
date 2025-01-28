const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BackTupti',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [
      {
        url: 'https://proyectotupti.onrender.com',
        description: 'Servidor Produccion',
      },
    ],
    paths: {
      '/auth/google': {
        get: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión con Google',
          description: 'Redirige al usuario a la página de inicio de sesión de Google',
          responses: {
            '302': {
              description: 'Redirección a Google',
            },
          },
        },
      },
      '/auth/google/callback': {
        get: {
          tags: ['Autenticación'],
          summary: 'Callback de Google OAuth',
          description: 'Endpoint para manejar la respuesta de autenticación de Google',
          responses: {
            '302': {
              description: 'Redirección después de la autenticación',
            },
          },
        },
      },
      '/auth/facebook': {
        get: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión con Facebook',
          description: 'Redirige al usuario a la página de inicio de sesión de Facebook',
          responses: {
            '302': {
              description: 'Redirección a Facebook',
            },
          },
        },
      },
      '/auth/facebook/callback': {
        get: {
          tags: ['Autenticación'],
          summary: 'Callback de Facebook OAuth',
          description: 'Endpoint para manejar la respuesta de autenticación de Facebook',
          responses: {
            '302': {
              description: 'Redirección después de la autenticación',
            },
          },
        },
      },
      '/auth/dashboard': {
        get: {
          tags: ['Autenticación'],
          summary: 'Dashboard del usuario',
          description: 'Página protegida que requiere autenticación',
          responses: {
            '200': {
              description: 'Usuario autenticado exitosamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                      },
                      user: {
                        type: 'object',
                        properties: {
                          IdUsuario: {
                            type: 'integer',
                          },
                          Email: {
                            type: 'string',
                          },
                          CodigoUs: {
                            type: 'string',
                          },
                          Activo: {
                            type: 'boolean',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '302': {
              description: 'Redirección a login si no está autenticado',
            },
          },
        },
      },
    },
  },
  apis: ['./src/presentation/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi: swaggerUi.serve,
  swaggerSpec,
};
