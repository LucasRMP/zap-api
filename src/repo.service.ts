import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '@entities/user.entity';
import Chat from '@entities/chat.entity';

@Injectable()
class RepoService {
  public constructor(
    @InjectRepository(User) public readonly userRepo: Repository<User>,
    @InjectRepository(Chat) public readonly chatRepo: Repository<Chat>
  ) {}
}

export default RepoService;
