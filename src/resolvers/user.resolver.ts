import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewUserInput } from './input/user.input';
import { UsersArgs } from './args/user.args';
import User from '@entities/user.entity';
import RepoService from '~/repo.service';
import { Repository } from 'typeorm';

@Resolver(() => User)
export class UserResolver {
  User: Repository<User>;

  constructor(private readonly repoService: RepoService) {
    this.User = repoService.userRepo;
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
  async users(@Args() { skip, take }: UsersArgs): Promise<User[]> {
    const users = await this.User.find({ skip, take });

    return users;
  }

  @Mutation(() => User)
  async addUser(@Args('input') newUserData: NewUserInput): Promise<User> {
    const user = this.User.create(newUserData);
    const newUser = await this.User.save(user);

    console.log({ newUser });
    return user;
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id') id: number): Promise<boolean> {
    const result = await this.User.softRemove({ id });
    return !!result;
  }
}
