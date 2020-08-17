import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class NewUserInput {
  @Field({ nullable: true })
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
