import {
  Args,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import {
  CommitFlowVersionArgs,
  ProcessConnectionsArgs,
  ProcessedConnections,
} from '../types/types';
import { BotFlowVersion } from '../../../prisma/generated/type-graphql';
import { Context } from '../../app.module';
import { LogAccess } from '../middlewares/logAccess';

@Resolver(String)
export class CustomResolver {
  @Query((_returns) => String, { nullable: true })
  @UseMiddleware(LogAccess)
  async bestUser(@Ctx() { prisma }: Context, @PubSub() pubSub: PubSubEngine) {
    // console.log({ pubSub });
    prisma.flowNode.delete({
      where: { id: 1 },
      include: { NodeProps: true, info: true },
    });
    return 'You are the best of the best!!:)))';
  }

  @Mutation((_returns) => ProcessedConnections)
  async processConnections(
    @Args() { add, remove }: ProcessConnectionsArgs,
    @Ctx() { prisma }: Context,
  ): Promise<ProcessedConnections> {
    // TODO wrap in transaction
    let id = await prisma.connection.count();
    const createdAt = new Date();
    const added = add.map((conn) => ({
      ...conn,
      id: ++id,
      clientId: conn.id,
      createdAt,
    }));
    await prisma.connection.createMany({ data: add });
    await prisma.connection.deleteMany(remove);
    return { added };
  }

  @Mutation((_returns) => BotFlowVersion)
  async commitFlowVersion(
    @Args() { connections, nodes, botFlowId }: CommitFlowVersionArgs,
    @Ctx() { prisma }: Context,
  ): Promise<BotFlowVersion> {
    let versionsCount = await prisma.botFlowVersion.count({
      where: { botFlowId },
    });
    const flowVersion = await prisma.botFlowVersion.create({
      data: { version: ++versionsCount, botFlowId },
    });

    const portsIdsMap: Record<number, number> = {};

    const promises = nodes.map(async (node) => {
      const clientIds: number[] = [];
      node.ports.createMany.data.forEach((port) => {
        clientIds.push(port.id);
        delete port.id;
      });
      const { ports } = await prisma.flowNode.create({
        data: node,
        include: { ports: true },
      });
      for (const idx in ports) {
        portsIdsMap[clientIds[idx]] = ports[idx].id;
      }
    });
    await Promise.all(promises);
    connections.forEach((conn) => {
      if (conn.to in portsIdsMap) {
        conn.to = portsIdsMap[conn.to];
      }
      if (conn.from in portsIdsMap) {
        conn.from = portsIdsMap[conn.from];
      }
    });
    await prisma.connection.createMany({ data: connections });

    return prisma.botFlowVersion.findUnique({
      where: { id: flowVersion.id },
      include: {
        nodes: {
          include: { ports: true },
        },
        connections: true,
      },
    });
  }
}
