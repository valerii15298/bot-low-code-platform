import { Injectable, Module, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { resolvers } from '@generated/type-graphql';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import path from 'path';
import {
  Ctx,
  MiddlewareInterface,
  NextFn,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  ResolverData,
  UseMiddleware,
} from 'type-graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import { PubSub as InMemoryPubSub } from 'graphql-subscriptions';
// const pubSub = new InMemoryPubSub();

interface Context {
  prisma: PrismaClient;
}
const prisma = new PrismaClient();

const emitSchemaFile = path.resolve(
  __dirname,
  '../../../packages/web/src/graphql/schema.graphql',
);

@Injectable()
export class LogAccess implements MiddlewareInterface {
  constructor(@PubSub() private pubSub: PubSubEngine) {}

  async use(ddd: ResolverData, next: NextFn): Promise<any> {
    return next();
  }
}

@Resolver(String)
class CustomUserResolver {
  @Query((returns) => String, { nullable: true })
  @UseMiddleware(LogAccess)
  async bestUser(@Ctx() { prisma }: Context, @PubSub() pubSub: PubSubEngine) {
    // console.log({ pubSub });
    return 'You are the best of the best!!:)))';
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
