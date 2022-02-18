import { Injectable, Module, Provider } from '@nestjs/common';
import {
  Connection,
  ConnectionCreateManyInput,
  DeleteManyConnectionArgs,
  resolvers,
  ConnectionCrudResolver,
  ConnectionWhereInput,
} from '../prisma/generated/type-graphql';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import path from 'path';

import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  MiddlewareInterface,
  Mutation,
  NextFn,
  ObjectType,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  ResolverData,
  UseMiddleware,
} from 'type-graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaClient } from '@prisma/client';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import { PubSub as InMemoryPubSub } from 'graphql-subscriptions';
// const pubSub = new InMemoryPubSub();

interface Context {
  prisma: PrismaClient;
}

const prisma = new PrismaClient();

const emitSchemaFile = path.resolve(
  __dirname,
  '../../../web/src/graphql/schema.graphql',
);

@Injectable()
export class LogAccess implements MiddlewareInterface {
  constructor(@PubSub() private pubSub: PubSubEngine) {}

  async use(ddd: ResolverData, next: NextFn): Promise<any> {
    return next();
  }
}

@InputType()
class ConnectionsWhere {
  @Field((type) => ConnectionWhereInput)
  where: ConnectionWhereInput;
}

@ArgsType()
class ProcessConnectionsArgs {
  @Field((type) => [ConnectionCreateManyInput])
  add: ConnectionCreateManyInput[];

  @Field((type) => ConnectionsWhere)
  remove: ConnectionsWhere;
}

@ObjectType()
class ProcessedConnections {
  @Field((type) => [Connection])
  added: Connection[];

  @Field((type) => [Connection])
  removed: Connection[];
}

@Resolver(String)
class CustomUserResolver {
  @Query((returns) => String, { nullable: true })
  @UseMiddleware(LogAccess)
  async bestUser(@Ctx() { prisma }: Context, @PubSub() pubSub: PubSubEngine) {
    // console.log({ pubSub });
    return 'You are the best of the best!!:)))';
  }

  @Mutation((returns) => ProcessedConnections)
  async processConnections(
    @Args() { add, remove }: ProcessConnectionsArgs,
    @Ctx() { prisma }: Context,
  ): Promise<ProcessedConnections> {
    prisma.connection.createMany({ data: add });
    prisma.connection.deleteMany(remove);
    return { added: [], removed: [] };
  }
}

console.log(process.env.DATABASE_URL, process.env.WEB_BASE_APP_PATH);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../../../web/dist'),
      serveRoot: process.env.WEB_BASE_APP_PATH,
    }),
    // use the TypeGraphQLModule to expose Prisma by GraphQL
    TypeGraphQLModule.forRoot({
      playground: true,
      introspection: true,
      // path: '/graphql',
      emitSchemaFile,
      validate: false,
      context: () => ({ prisma }),
      globalMiddlewares: [LogAccess],
      // pubSub,
    }),
  ],
  controllers: [],
  providers: [
    // register all resolvers inside `providers` of the Nest module
    ...(resolvers as unknown as Array<Provider<any>>),
    CustomUserResolver,
    LogAccess,
    PubSubEngine as any,
  ],
})
export class AppModule {}
