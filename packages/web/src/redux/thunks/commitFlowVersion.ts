import { createAsyncThunk } from "@reduxjs/toolkit";
import { flowType } from "../../types/reduxStoreState";
import { selectActiveDrawflow } from "../drawflowSlice";
import { exclude } from "../../models/tools";
import { portType } from "../../spacing";
import { botFlowId, sdk } from "../api";

export const commitFlowVersionThunk = createAsyncThunk(
  "commitFlowVersionThunk",
  (_, { getState }) => {
    console.log("commitFlowVersion");
    const appState = getState() as flowType;
    const { connections, ports, drawflow } = selectActiveDrawflow(appState);
    sdk
      .commitBotFlowVersion({
        botFlowId,
        connections: Object.values(connections).map((conn) => ({
          id: conn.id,
          botFlowVersionId: appState.version,
          from: conn.fromPort.id,
          to: conn.toPort.id,
        })),
        nodes: Object.values(drawflow).map(({ info, NodeProps, id }) => {
          const { type } = NodeProps;
          const propsKey = `Node${type}Props` as const;
          const props = NodeProps[propsKey];
          return {
            flow: { connect: { id: appState.version + 1 } },
            info: { create: exclude(info, "id") },
            NodeProps: {
              create: {
                type: NodeProps.type,
                [propsKey]: { create: props },
              },
            },
            ports: {
              createMany: {
                data: Object.values(ports)
                  .filter((port) => port.nodeId === id)
                  .map((port) => ({
                    id: port.id,
                    index: port.portId + Number(port.type === portType.out),
                  })),
              },
            },
          };
        }),
      })
      .then(() => alert("Commited successfully"))
      .catch((err) => console.log({ err }));
  }
);
