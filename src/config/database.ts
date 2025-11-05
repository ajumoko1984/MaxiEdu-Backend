import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'maxiedu',
  synchronize: !isProd, // Only true in development
  logging: !isProd,
  entities: [User], // Add other entities here
  subscribers: [],
  migrations: [],
  ssl: isProd ? {
    rejectUnauthorized: true
  } : undefined,
  extra: isProd ? {
    ssl: {
      rejectUnauthorized: true
    }
  } : undefined
});