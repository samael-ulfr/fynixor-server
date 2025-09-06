const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fynixor API v1",
      version: "1.0.0",
      description: "API documentation for Fynixor",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
