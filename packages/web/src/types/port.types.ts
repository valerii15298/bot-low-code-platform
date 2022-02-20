import { idFlowNodeType } from "./node.types";
import { portType } from "../spacing";
import { pos } from "./helpers";

export type idPortType = number;

export interface purePort {
  id: idPortType;
  nodeId: idFlowNodeType;
  portId: number;
  type: portType;
  // TODO delete field, maybe change to index in future
}

export interface Port extends purePort {
  pos: pos;
}

export type ports = Record<idPortType, Port>;
