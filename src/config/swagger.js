const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vidar API v1",
      version: "1.0.0",
      description: "API documentation for Vidar",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
