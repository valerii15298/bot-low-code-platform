import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { resolvers } from '../prisma/generated/type-graphql';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import path from 'path';

const prisma = new PrismaClient();
const emitSchemaFile = path.resolve(
  __dirname,
  '../../../web/src/graphql/schema.graphql',
);

@Module({
  imports: [
    // use the TypeGraphQLModule to expose Prisma by GraphQL
    TypeGraphQLModule.forRoot({
      playground: true,
      introspection: true,
      // path: '/graphql',
      emitSchemaFile,
      validate: false,
      context: () => ({ prisma }),
    }),
  ],
  controllers: [],
  providers: [
    // register all resolvers inside `providers` of the Nest module
    ...(resolvers as any),
  ],
})
export class AppModule {}
