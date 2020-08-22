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
import { Repository } from 'typeorm';

import { PubSub } from 'apollo-server';

import Message from '@entities/message.entity';
import RepoService from '~/repo.service';

import { MessagesArgs } from './args/message.args';
import { NewMessageInput } from './input/message.input';

const events = {
  ADD_MESSAGE: 'addedMessage',
};

@Resolver(() => Message)
export class MessageResolver {
  Message: Repository<Message>;
  config: ConfigService;
  pubSub: PubSub;

  constructor(
    private readonly repoService: RepoService,
    private readonly configService: ConfigService
  ) {
    this.Message = repoService.messageRepo;
    this.config = configService;
    this.pubSub = new PubSub();
  }

  @Subscription(() => Message, {
    filter: (payload, variables, context) =>
      payload[events.ADD_MESSAGE].hostId === context.id,
  })
  async addedMessage(@Context() ctx) {
    return this.pubSub.asyncIterator(events.ADD_MESSAGE);
  }

  @Query(() => Message)
  async message(@Args('id') id: string): Promise<Message> {
    const message = await this.Message.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(id);
    }
    return message;
  }

  @Query(() => [Message])
  async messages(@Args() { skip, take }: MessagesArgs): Promise<Message[]> {
    return this.Message.find({
      skip,
      take,
    });
  }

  @Mutation(() => Message)
  async addMessage(
    @Args('input') newMessageData: NewMessageInput,
    @Context() ctx
  ): Promise<Message> {
    const input = {
      ...newMessageData,
      author_id: ctx.id,
    };

    const newMessage = this.Message.create(input);
    const message = await this.Message.save(newMessage);

    this.pubSub.publish(events.ADD_MESSAGE, { [events.ADD_MESSAGE]: message });
    return message;
  }

  @Mutation(() => Boolean)
  async removeMessage(@Args('id') id: number): Promise<boolean> {
    const result = await this.Message.softRemove({ id });
    return !!result;
  }
}
