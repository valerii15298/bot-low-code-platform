import { Args, Ctx, Mutation, Resolver } from 'type-graphql';
import {
  DeleteFlowNodeArgs,
  FlowNode,
} from '../../../prisma/generated/type-graphql';
import { Context } from '../../app.module';

@Resolver((_of) => FlowNode)
export class DeleteFlowNodeResolver {
  @Mutation((_returns) => FlowNode, {
    nullable: true,
  })
  async deleteFlowNode(
    @Ctx() { prisma }: Context,
    @Args() args: DeleteFlowNodeArgs,
  ): Promise<FlowNode | null> {
    // ports and connections
    // will be deleted automatically using cascade on database level
    const {
      where: { id, nodeInfoId, nodePropsId },
    } = args;
    // const deleteNode = prisma.flowNode.delete({
    //   where: { id },
    // });

    const deleteNodeProps = prisma.nodeProps.delete({
      where: { id: nodePropsId },
    });
    const deleteNodeInfo = prisma.nodeInfo.delete({
      where: { id: nodeInfoId },
    });
    await prisma.$transaction([deleteNodeProps, deleteNodeInfo]);
    return null;
  }
}
