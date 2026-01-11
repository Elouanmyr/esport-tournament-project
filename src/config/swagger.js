import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-sport Tournament API',
      version: '1.0.0',
      description: 'API REST pour la gestion de tournois et d\'équipes e-sport',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.js'], //  Lis les commentaires Swagger dans les routes
}

export const swaggerSpec = swaggerJsDoc(swaggerOptions)