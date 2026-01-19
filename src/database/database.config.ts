import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { PasswordHistory } from '../entities/password-history.entity';
import { VerificationToken } from '../entities/verification-token.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'socger',
  password: process.env.DB_PASSWORD || 'dcb4f2e8106a0ef44c3f530d3ae3f9fd',
  database: process.env.DB_DATABASE || 'socgerfleet',
  entities: [User, Role, RefreshToken, PasswordHistory, VerificationToken],
  migrations: ['dist/database/migrations/**/*.js'],
  synchronize: false, // IMPORTANTE: false cuando usamos migraciones
  logging: process.env.NODE_ENV === 'development',
});
