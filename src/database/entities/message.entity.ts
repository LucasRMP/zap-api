import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import Chat from './chat.entity';
import User from './user.entity';

@ObjectType()
@Entity({ name: 'messages' })
export default class Message {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  authorId: number;

  @OneToOne(() => User)
  @JoinColumn()
  author: User;

  @Field()
  @Column()
  chatId: number;

  @OneToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;
}
