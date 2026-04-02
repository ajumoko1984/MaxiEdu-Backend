import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MaxiEdu API Documentation',
      version: '1.0.0',
      description: 'API documentation for MaxiEdu School Management System',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-render-url.onrender.com'  // Update this with your Render URL
          : `http://localhost:${process.env.APP_PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: process.env.NODE_ENV === 'production' 
    ? ['./build/routes/*.js']
    : ['./src/routes/*.ts', './build/routes/*.js'],
};

export const specs = swaggerJsdoc(options);