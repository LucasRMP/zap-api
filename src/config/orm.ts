import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import dotenv from 'dotenv';
import path from 'path';
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
  synchronize: false,
  logging: 'all',
  namingStrategy: new SnakeNamingStrategy(),
};

module.exports = options;
