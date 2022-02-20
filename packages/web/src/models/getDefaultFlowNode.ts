import { getDefaultPureTemplateNode } from "./getDefaultPureTemplateNode";
import { node } from "../types/node.types";

export const getDefaultFlowNode = (): node => ({
  ...getDefaultPureTemplateNode(),
  id: 0,
  pos: {
    x: 0,
    y: 0,
  },
  isSub: false,
  height: 0,
  width: 0,
  visible: 0,
});
