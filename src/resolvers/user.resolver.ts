import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { Repository, Not } from 'typeorm';

import { PubSub } from 'apollo-server';

import User from '@entities/user.entity';
import { AuthService } from '~/auth/auth.service';
import RepoService from '~/repo.service';

import { UsersArgs } from './args/user.args';
import { LoginResult } from './dto/user.dto';
import { NewUserInput, LoginUserInput } from './input/user.input';

const events = {
  ADD_USER: 'addedUser',
};

@Resolver(() => User)
export class UserResolver {
  User: Repository<User>;
  pubSub: PubSub;

  constructor(
    private readonly repo: RepoService,
    private readonly config: ConfigService,
    private readonly auth: AuthService
  ) {
    this.User = repo.userRepo;
    this.pubSub = new PubSub();
  }

  @Subscription(() => User)
  async addedUser() {
    return this.pubSub.asyncIterator(events.ADD_USER);
  }

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.User.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Query(() => [User])
  async users(
    @Context() ctx,
    @Args() { skip, take, not }: UsersArgs
  ): Promise<User[]> {
    const users = await this.User.find({
      where: { id: Not(not) },
      skip,
      take,
    });

    return users;
  }

  @Mutation(() => User)
  async addUser(@Args('input') newUserData: NewUserInput): Promise<User> {
    const newUser = this.User.create(newUserData);
    const user = await this.User.save(newUser);

    this.pubSub.publish(events.ADD_USER, { [events.ADD_USER]: user });
    return user;
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: number): Promise<boolean> {
    const result = await this.User.softRemove({ id });
    return !!result;
  }

  @Mutation(() => LoginResult)
  async loginUser(@Args('input') { email }: LoginUserInput): Promise<any> {
    const user: any = await this.User.findOneOrFail({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { id, name, createdAt, updatedAt } = user;

    const token = this.auth.authenticate({ id, name, createdAt, updatedAt });

    return { token, user };
  }
}
