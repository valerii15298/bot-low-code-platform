import { actions } from "./drawflowSlice";
import { processConnectionsThunk } from "./thunks/canvasMouseUp";

export const mapClientActionToServerAction = {
  [actions.processConnections.type]: processConnectionsThunk,
  // [actions.processFlowNodes]: processFlowNodesThunk
};
