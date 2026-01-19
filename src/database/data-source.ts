import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'socger',
  password: process.env.DB_PASSWORD || 'dcb4f2e8106a0ef44c3f530d3ae3f9fd',
  database: process.env.DB_DATABASE || 'socgerfleet',
  entities: ['src/entities/**/*.entity.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: false, // IMPORTANTE: Debe estar en false al usar migraciones
  logging: process.env.NODE_ENV === 'development',
});
