import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '..', 'database', 'entities', '*')],
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*')],
  synchronize: process.env.ENV === 'dev',
  logging: 'all',
};

module.exports = options;
