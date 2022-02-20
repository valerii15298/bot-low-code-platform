import { pos, RecursivePartial } from "./helpers";
import { versions } from "./botFlow.types";

export type sNode = versions[number]["nodes"][number];
export type idFlowNodeType = sNode["id"];
export type moveNodeType = {
  dx: number;
  dy: number;
  nodeId: idFlowNodeType;
};
export type pureTemplateNode = Pick<sNode, "NodeProps" | "info">;

export interface dataNode extends Omit<sNode, "ports" | "id"> {
  pos: pos;
  isSub: boolean;
}

export interface node extends dataNode {
  id: idFlowNodeType;
  height: number;
  width: number;
  lane?: number;
  head?: number;
  positionNumber?: number;
  subnodesVisibility?: boolean;
  childrenVisibility?: boolean;
  visible: number;
  selected?: boolean;
}

export type pureNode = Omit<node, "pos">;
export type updateNode = RecursivePartial<node>;
export type drawflow = Record<idFlowNodeType, node>;
