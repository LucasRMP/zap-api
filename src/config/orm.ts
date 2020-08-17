import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'gql',
  entities: [path.join(__dirname, '..', 'database', 'entities', '*')],
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*')],
  synchronize: process.env.ENV === 'dev',
  logging: 'all',
};

module.exports = options;
