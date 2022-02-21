import { createAsyncThunk } from "@reduxjs/toolkit";
import { idPortType, purePort } from "../../types/port.types";
import { portType } from "../../spacing";
import { idFlowNodeType, node } from "../../types/node.types";
import { idConnType, pureConnection } from "../../types/connection.types";
import { botFlowId, sdk } from "../api";

export const fetchBotFlowThunk = createAsyncThunk("fetchBotFlow", async () => {
  const data = await sdk.botFlow({ where: { id: botFlowId } });
  const arr = data.botFlow?.versions.map((ver) => {
    const ports: Record<idPortType, purePort> = {};
    const drawflow = ver.nodes.reduce((acc, v) => {
      acc[v.id] = v;
      v.ports.forEach(
        ({ id, index }) =>
          (ports[id] = {
            id,
            type: index === 1 ? portType.in : portType.out,
            nodeId: v.id,
            portId: index - Number(index !== 1),
          })
      );
      return acc;
    }, {} as Record<idFlowNodeType, Pick<node, "id" | "NodeProps" | "info">>);
    const connections = ver.connections.reduce((acc, v) => {
      acc[v.id] = {
        ...v,
      };
      return acc;
    }, {} as Record<idConnType, pureConnection>);
    return [
      ver.id,
      {
        drawflow,
        ports,
        connections,
      },
    ] as const;
  });
  if (!arr) return;
  // console.log({ arr });
  return Object.fromEntries(arr);
});
