import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Create a new OpenAPI registry
export const registry = new OpenAPIRegistry();

// Define the OpenAPI document configuration
const openApiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'U-Homes API Documentation',
    version: '1.0.0',
    description: 'API documentation for the U-Homes backend service.',
  },
  servers: [
    {
      url: process.env.BASE_URL || 'https://localhost:7000',
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
      name: 'Students',
      description: 'Endpoints related to student registration, login, and profile management',
    },
    {
      name: 'Agents',
      description: 'Endpoints related to agent registration, login, and dashboard access',
    },
    {
      name: 'Admins',
      description: 'Endpoints for admin management, user oversight, and system control',
    },
    {
      name: 'Authentication',
      description: 'Shared authentication routes for password reset, email verification, etc.',
    },
    {
      name: 'Properties',
      description: 'Property management endpoints',
    },
    {
      name: 'Bookings',
      description: 'Booking management endpoints',
    },
  ],
};

// Generate the OpenAPI document
// Note: This is called after all routers are imported in app.ts
export const getSwaggerSpec = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument(openApiConfig);
};

export const swaggerDocs = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(getSwaggerSpec(), {
      customSiteTitle: 'U-Homes API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
