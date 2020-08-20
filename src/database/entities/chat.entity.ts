import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import User from './user.entity';

@ObjectType()
@Entity({ name: 'chats' })
export default class Chat {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'host_id' })
  hostId: number;

  @OneToOne(() => User)
  @JoinColumn()
  host: User;

  @Field()
  @Column({ name: 'guest_id' })
  guestId: number;

  @OneToOne(() => User)
  @JoinColumn()
  guest: User;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
