import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '@entities/user.entity';

@Injectable()
class RepoService {
  public constructor(
    @InjectRepository(User) public readonly userRepo: Repository<User>
  ) {}
}

export default RepoService;
