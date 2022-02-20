import { ArgsType, Field, InputType, ObjectType } from 'type-graphql';
import {
  Connection,
  ConnectionCreateManyInput,
  ConnectionWhereInput,
  FlowNodeCreateInput,
} from '../../../prisma/generated/type-graphql';

@InputType()
class ConnectionsWhere {
  @Field((_type) => ConnectionWhereInput)
  where: ConnectionWhereInput;
}

@ArgsType()
export class ProcessConnectionsArgs {
  @Field((_type) => [ConnectionCreateManyInput])
  add: ConnectionCreateManyInput[];

  @Field((_type) => ConnectionsWhere)
  remove: ConnectionsWhere;
}

@ObjectType()
class PrecessedConnection extends Connection {
  @Field((_type) => Number)
  clientId: number;
}

@ArgsType()
export class CommitFlowVersionArgs {
  @Field((_type) => [FlowNodeCreateInput])
  nodes: FlowNodeCreateInput[];

  @Field((_type) => [ConnectionCreateManyInput])
  connections: [ConnectionCreateManyInput];

  @Field((_type) => Number)
  botFlowId: number;
}

@ObjectType()
export class ProcessedConnections {
  @Field((_type) => [PrecessedConnection])
  added: PrecessedConnection[];
}
