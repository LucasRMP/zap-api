import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Chat from '@entities/chat.entity';
import Message from '@entities/message.entity';
import User from '@entities/user.entity';

import RepoService from './repo.service';

const entities = [User, Chat, Message];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [RepoService],
  exports: [RepoService],
})
export default class RepoModule {}
