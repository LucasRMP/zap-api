import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class NewChatInput {
  @Field()
  hostId: number;

  @Field()
  guestId: number;
}
