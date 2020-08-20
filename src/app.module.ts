import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { DateScalar } from '@common/scalars/date.scalar';
import * as ormConfig from '@config/orm';
import RepoModule from './repo.module';
import { UserResolver } from '@resolvers/user.resolver';
import { ChatResolver } from '@resolvers/chat.resolver';

const gqlResolvers = [UserResolver, ChatResolver];

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    RepoModule,
    ...gqlResolvers,
  ],
  providers: [DateScalar],
})
export class AppModule {}
