import { Repository, Not, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ValidationError } from 'apollo-server';

import { NewChatInput } from './input/chat.input';
import { ChatsArgs } from './args/chat.args';
import RepoService from '~/repo.service';
import Chat from '@entities/chat.entity';
import User from '@entities/user.entity';

@Resolver(() => Chat)
export class ChatResolver {
  Chat: Repository<Chat>;
  User: Repository<User>;
  config: ConfigService;

  constructor(
    private readonly repoService: RepoService,
    private configService: ConfigService
  ) {
    this.Chat = repoService.chatRepo;
    this.User = repoService.userRepo;
    this.config = configService;
  }

  @ResolveField(() => User)
  async host(@Parent() { hostId }: Chat): Promise<User> {
    return await this.User.findOne({ where: { id: hostId } });
  }

  @ResolveField(() => User)
  async guest(@Parent() { guestId }: Chat): Promise<User> {
    return await this.User.findOne({ where: { id: guestId } });
  }

  @Query(() => Chat)
  async chat(@Args('id') id: string): Promise<Chat> {
    return await this.Chat.findOne({ where: { id } });
  }

  @Query(() => [Chat])
  async chats(@Args() { skip, take }: ChatsArgs): Promise<Chat[]> {
    const chats = await this.Chat.find({
      skip,
      take,
    });

    return chats;
  }

  @Mutation(() => Chat)
  async addChat(@Args('input') newChatData: NewChatInput): Promise<Chat> {
    const { guestId, hostId } = newChatData;

    if (guestId === hostId) {
      throw new ValidationError('Guest and host must be different users');
    }

    const checkExists = await this.Chat.findOne({
      where: { guestId: In([guestId, hostId]), hostId: In([guestId, hostId]) },
    });
    if (checkExists) {
      throw new ValidationError('Chat with these users alredy exists');
    }

    const chat = this.Chat.create(newChatData);

    return this.Chat.save(chat);
  }

  @Mutation(() => Boolean)
  async removeChat(@Args('id') id: number): Promise<boolean> {
    const result = await this.Chat.softRemove({ id });
    return !!result;
  }
}
