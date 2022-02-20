import { getDefaultNodeProps } from "./getDefaultNodeProps";
import { pureTemplateNode } from "../types/node.types";

export const getDefaultPureTemplateNode = (): pureTemplateNode => ({
  info: {
    id: 0,
    description: "Default template",
    name: "Default template",
    iconLink: "Default template",
  },
  NodeProps: getDefaultNodeProps(),
});
