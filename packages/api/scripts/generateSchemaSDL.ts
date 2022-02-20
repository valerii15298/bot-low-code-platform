import 'reflect-metadata';

import * as customResolvers from '../src/type-graphql/resolvers';
import { buildSchema, emitSchemaDefinitionFile } from 'type-graphql';
import { resolvers } from '../prisma/generated/type-graphql';
import path from 'path';
export const generateSchemaSDL = async () => {
  const schema = await buildSchema({
    resolvers: [...resolvers, ...Object.values(customResolvers)],
    validate: true,
  });
  await emitSchemaDefinitionFile(
    path.resolve(__dirname, '../../web/src/graphql/schema.graphql'),
    schema,
  );
};

generateSchemaSDL().then(() => {
  console.log('SDL schema generation finished');
});
