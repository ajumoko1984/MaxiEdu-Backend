import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

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
          ? 'https://maxiedu-latest.onrender.com'  // Your Render URL
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
    ? [path.join(process.cwd(), 'build/routes/*.ts')]
    : [path.join(process.cwd(), 'src/routes/*.ts')],
};

export const specs = swaggerJsdoc(options);