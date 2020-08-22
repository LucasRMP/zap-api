import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import User from './user.entity';

@ObjectType()
@Entity({ name: 'chats' })
export default class Chat {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  hostId: number;

  @OneToOne(() => User)
  @JoinColumn()
  host: User;

  @Field()
  @Column()
  guestId: number;

  @OneToOne(() => User)
  @JoinColumn()
  guest: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @CreateDateColumn()
  updatedAt: Date;
}
