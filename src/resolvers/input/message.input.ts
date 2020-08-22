import { Field, InputType } from '@nestjs/graphql';

import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewMessageInput {
  @Field()
  @MaxLength(255)
  @IsOptional()
  content: string;

  @Field()
  chatId: number;
}
