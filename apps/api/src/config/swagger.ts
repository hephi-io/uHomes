import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'U-Homes API Documentation',
      version: '1.0.0',
      description: 'API documentation for the U-Homes backend service.',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:7000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Auth',
        description:
          'Authentication and authorization endpoints (register, login, password reset, etc.)',
      },
      {
        name: 'Users',
        description: 'User management and dashboard endpoints',
      },
      {
        name: 'Properties',
        description: 'Property management endpoints',
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints',
      },
      {
        name: 'Reviews',
        description: 'Property review endpoints',
      },
    ],
  },
  apis: ['./src/routers/*.ts', './src/docs/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'U-Homes API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
