import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Assignment Log Book API",
      version: "1.0.0",
      description: "API documentation for Assignment Log Book App",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./app/api/**/*.ts"], // scans API routes
};

export const swaggerSpec = swaggerJsdoc(options);
