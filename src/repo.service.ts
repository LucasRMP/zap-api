import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Chat from '@entities/chat.entity';
import Message from '@entities/message.entity';
import User from '@entities/user.entity';

@Injectable()
class RepoService {
  public constructor(
    @InjectRepository(User) public readonly userRepo: Repository<User>,
    @InjectRepository(Chat) public readonly chatRepo: Repository<Chat>,
    @InjectRepository(Message) public readonly messageRepo: Repository<Message>
  ) {}
}

export default RepoService;
