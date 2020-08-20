import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RepoService from './repo.service';

import User from '@entities/user.entity';
import Chat from '@entities/chat.entity';

const entities = [User, Chat];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [RepoService],
  exports: [RepoService],
})
export default class RepoModule {}
