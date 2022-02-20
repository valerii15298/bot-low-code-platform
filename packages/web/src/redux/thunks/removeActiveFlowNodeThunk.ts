import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  actions,
  getDefaultProcessEntitiesPayload,
  processEntities,
  selectActiveDrawflow,
} from "../drawflowSlice";
import { flowType } from "../../types/reduxStoreState";
import { Flow } from "../Flow";
import { sdk, undoThunk } from "../api";
import { stateData } from "../../types/currentBotFlowVersion";
import { copyStateData } from "../copyStateData";
import { getId } from "../getId";
import { setStateAction } from "../actions";

export const removeActiveFlowNodeThunk = createAsyncThunk(
  "removeActiveFlowNodeThunk",
  (_, { dispatch, getState }) => {
    const state = selectActiveDrawflow(getState() as flowType);

    const { drawflow, ports, select, connections } = state;
    if (select?.type !== "node") return;
    const { selectId } = select;
    const flow = new Flow(state);
    const selectedNode = flow.getNode(selectId);

    const data = getDefaultProcessEntitiesPayload();

    // find and delete connections
    Object.values(connections).forEach((conn) => {
      const { fromPort, toPort } = conn;
      if (
        selectedNode.nodePorts.some((p) =>
          [fromPort.id, toPort.id].includes(p.id)
        )
      ) {
        data.connections.remove.push(conn.id);
      }
    });

    // find and delete ports
    Object.values(ports).forEach((port) => {
      if (port.nodeId === selectId) {
        data.ports.remove.push(port.id);
      }
    });

    // 3. find in drawflow
    data.drawflow.remove.push(selectId);

    if (state.isDraft || state.live) {
      dispatch(actions.processEntities({ data, pushToUndoRedo: true }));
    }

    if (state.live) {
      sdk
        .deleteFlowNode({
          where: {
            id: selectId,
            nodePropsId: drawflow[selectId].NodeProps.id,
            nodeInfoId: drawflow[selectId].info.id,
          },
        })
        .then(() => console.log("success" /* do nothing*/))
        .catch(() => {
          dispatch(undoThunk());
        });
    } else if (!state.isDraft) {
      const copiedOldState = JSON.parse(JSON.stringify(state)) as stateData;
      processEntities(copiedOldState, {
        payload: { data },
        type: "processConnections",
      });
      dispatch(actions.setState({ select: null }));
      const copiedNewState = copyStateData(copiedOldState);
      const newFlowVersionId = getId();
      dispatch(
        setStateAction({
          version: newFlowVersionId,
          flows: { [newFlowVersionId]: { ...copiedNewState, isDraft: true } },
        })
      );
    }
  }
);
