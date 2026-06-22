const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Messaging App API',
    version: '1.0.0',
    description: 'REST API documentation for the chat backend.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '665f1a2b3c4d5e6f7a8b9c0d',
          },
          username: {
            type: 'string',
            example: 'alice',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '665f1a2b3c4d5e6f7a8b9c0e',
          },
          sender: {
            type: 'string',
            example: 'alice',
          },
          receiver: {
            type: 'string',
            example: 'bob',
          },
          text: {
            type: 'string',
            example: 'Hello Bob',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'username is required',
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

module.exports = swaggerJsdoc(swaggerOptions);