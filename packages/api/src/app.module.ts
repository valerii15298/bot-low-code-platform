import { Module } from '@nestjs/common';
import {
  applyResolversEnhanceMap,
  resolvers,
  ResolversEnhanceMap,
} from '../prisma/generated/type-graphql';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import path from 'path';

import { PubSubEngine } from 'type-graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaClient } from '@prisma/client';
import { LogAccess } from './type-graphql/middlewares/logAccess';
import { CustomResolver } from './type-graphql/resolvers/custom.resolver';
import { DeleteFlowNodeResolver } from './type-graphql/resolvers/deleteFlowNode.resolver';
import { DeleteTemplateNodeResolver } from './type-graphql/resolvers/deleteTemplateNode.resolver';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import { PubSub as InMemoryPubSub } from 'graphql-subscriptions';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// const pubSub = new InMemoryPubSub();

const resolversEnhanceMap: ResolversEnhanceMap = {
  FlowNode: {},
};

applyResolversEnhanceMap(resolversEnhanceMap);

export interface Context {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../../../web/dist'),
      serveRoot: process.env.WEB_BASE_APP_PATH,
    }),
    // use the TypeGraphQLModule to expose Prisma by GraphQL
    TypeGraphQLModule.forRoot({
      // playground: true,
      // introspection: true,
      // path: process.env.GRAPHQL_API_PATH,
      validate: false,
      context: () => ({ prisma }),
      globalMiddlewares: [LogAccess],
      // pubSub,
    }),
  ],

  controllers: [],
  providers: [
    // register all resolvers inside `providers` of the Nest module
    ...(resolvers as any),
    CustomResolver,
    DeleteFlowNodeResolver, //overwrite
    DeleteTemplateNodeResolver, //overwrite
    LogAccess,
    PubSubEngine,
  ],
})
export class AppModule {}
