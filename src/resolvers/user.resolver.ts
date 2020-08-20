import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NewUserInput } from './input/user.input';
import { UsersArgs } from './args/user.args';
import User from '@entities/user.entity';
import RepoService from '~/repo.service';
import { Repository, Not } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PubSub } from 'apollo-server';

const events = {
  ADD_USER: 'addedUser',
};

@Resolver(() => User)
export class UserResolver {
  User: Repository<User>;
  config: ConfigService;
  pubSub: PubSub;

  constructor(
    private readonly repoService: RepoService,
    private configService: ConfigService
  ) {
    this.User = repoService.userRepo;
    this.config = configService;
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
      throw new NotFoundException(id);
    }
    return user;
  }

  @Query(() => [User])
  async users(@Args() { skip, take, not }: UsersArgs): Promise<User[]> {
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
}
