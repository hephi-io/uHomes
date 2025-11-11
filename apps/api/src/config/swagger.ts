import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "U-Homes API Documentation",
      version: "1.0.0",
      description: "API documentation for the U-Homes backend service.",
    },
    servers: [
      {
        url: process.env.BASE_URL || "https://localhost:7000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
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
          name: "Students",
          description: "Endpoints related to student registration, login, and profile management",
       },
    ],

  },
  apis: ["./src/routers/*.ts", "./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express, port: number) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "U-Homes API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );


};
