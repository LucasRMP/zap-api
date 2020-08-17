import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DateScalar } from '@common/scalars/date.scalar';
import * as ormConfig from '@config/orm';
import RepoModule from './repo.module';
import { UserResolver } from '@resolvers/user.resolver';

const gqlResolvers = [UserResolver];

@Module({
  imports: [
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRoot(ormConfig),
    RepoModule,
    ...gqlResolvers,
  ],
  providers: [DateScalar],
})
export class AppModule {}
