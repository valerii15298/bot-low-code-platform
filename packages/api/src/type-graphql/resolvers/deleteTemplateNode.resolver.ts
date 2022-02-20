import { Args, Ctx, Mutation, Resolver } from 'type-graphql';
import {
  DeleteTemplateNodeArgs,
  TemplateNode,
} from '../../../prisma/generated/type-graphql';
import { Context } from '../../app.module';

@Resolver((_of) => TemplateNode)
export class DeleteTemplateNodeResolver {
  @Mutation((_returns) => TemplateNode, {
    nullable: true,
  })
  async deleteTemplateNode(
    @Ctx() { prisma }: Context,
    @Args() args: DeleteTemplateNodeArgs,
  ): Promise<TemplateNode | null> {
    const {
      where: { id, nodeInfoId, nodePropsId },
    } = args;
    // const deleteNode = prisma.templateNode.delete({
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
