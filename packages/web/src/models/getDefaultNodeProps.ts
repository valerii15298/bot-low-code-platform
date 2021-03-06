import { NodeProps, NodeType } from "../generated/graphql-request";
import { ObjectKeys } from "../types/helpers";

export const getDefaultNodeProps = () =>
  ObjectKeys(NodeType).reduce((acc, next) => {
    acc[`Node${next}Props`] = null;
    return acc;
  }, {} as NodeProps);
