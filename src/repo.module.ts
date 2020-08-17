import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RepoService from './repo.service';
import User from '@entities/user.entity';

const entities = [User];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [RepoService],
  exports: [RepoService],
})
export default class RepoModule {}
