import { Field, ObjectType } from '@nestjs/graphql';

import User from '@entities/user.entity';

@ObjectType()
export class LoginResult {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
