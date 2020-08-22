import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DateScalar } from '@common/scalars/date.scalar';
import * as ormConfig from '@config/orm';
import { getUserLoader } from '@loaders/user.loader';
import { ChatResolver } from '@resolvers/chat.resolver';
import { MessageResolver } from '@resolvers/message.resolver';
import { UserResolver } from '@resolvers/user.resolver';

import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import RepoModule from './repo.module';

const gqlResolvers = [UserResolver, ChatResolver, MessageResolver];

const addons = [RepoModule, AuthModule];

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }: any) => {
        return {
          user: req.user,
          isAuth: !!req.auth,
          userLoader: getUserLoader(),
        };
      },
    }),
    TypeOrmModule.forRoot(ormConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    ...addons,
    ...gqlResolvers,
  ],
  providers: [DateScalar],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
