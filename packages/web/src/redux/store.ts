import { configureStore, createReducer, current } from "@reduxjs/toolkit";
import lodash from "lodash";
import { getDefaultFlowNode } from "../models/getDefaultFlowNode";
import { getFlowInitialState } from "../models/getFlowInitialState";
import handler from "../models/tools";
import {
  addNewNode,
  canvasShapeUpdated,
  insertCopiedNode,
  setStateAction,
  stateReplaceAll,
  toggleSidebar,
  updateConnectionsIds,
} from "./actions";
import { fetchBotFlow } from "./api";
import { drawflowSlice, selectActiveDrawflow } from "./drawflowSlice";
import { getDefaultStateData } from "../models/getDefaultStateData";
import { setState } from "./setState";
import { portType, Slices } from "../spacing";
import { clientPos, ObjectKeys } from "../types/helpers";
import { flowType } from "../types/reduxStoreState";
import { node } from "../types/node.types";
import { connections } from "../types/connection.types";

const reducer = createReducer(getFlowInitialState(), (builder) => {
  builder
    .addCase(updateConnectionsIds, (appState, { payload }) => {
      const { mapClientIdToServerId } = payload;
      const state = appState.flows[payload.flowVersion];
      state.connections = Object.values(state.connections).reduce(
        (prevConnections, nextConnection) => {
          if (nextConnection.id in mapClientIdToServerId) {
            const newId = mapClientIdToServerId[nextConnection.id];
            return {
              ...prevConnections,
              [newId]: { ...nextConnection, id: newId },
            };
          }
          return {
            ...prevConnections,
            [nextConnection.id]: nextConnection,
          };
        },
        {} as connections
      );
    })
    .addCase(setStateAction, setState)
    .addCase(insertCopiedNode, (appState) => {
      const state = selectActiveDrawflow(appState);
      if (state.nodeToCopyId === null) return;
      const { clientX, clientY } = state.clientCurrentMousePos as clientPos;
      const node = JSON.parse(
        JSON.stringify(state.drawflow[state.nodeToCopyId])
      );
      if (!appState.canvas) {
        console.error("Canvas shape is not available");
        return;
      }
      node.pos = handler.getPos(
        clientX,
        clientY,
        state.config.zoom.value,
        appState.canvas
      );
      const getId = () => {
        const ids = ObjectKeys(state.drawflow);
        return ids.length ? Math.max(...ids) + 1 : 1;
      };

      const id = getId();
      state.drawflow[id] = {
        ...node,
        id,
        height: 0,
        width: 0,
      };
    })

    .addCase(
      addNewNode,
      (appState: flowType, { payload: { clientX, clientY, templateNode } }) => {
        const state = appState.flows[appState.version];

        if (!appState.canvas) {
          throw new TypeError("Canvas shape is not available");
        }
      }
    )
    .addCase(canvasShapeUpdated, (appState, { payload }) => {
      appState.canvas = payload;
    })

    .addCase(fetchBotFlow.fulfilled, (state, { payload }) => {
      if (!payload) return;

      const { flows } = state;
      const newFlows = {} as typeof flows;
      for (const id in flows) {
        if (!(id in payload)) {
          newFlows[id] = flows[id];
        }
      }
      for (const flowId in payload) {
        const newFlow = payload[flowId];
        const oldFlow = flows[flowId];
        const flow = (newFlows[flowId] = getDefaultStateData());

        if (oldFlow) {
          lodash.merge(flow, oldFlow);
        }
        // merge connections
        flow.connections = {};
        for (const connId in newFlow.connections) {
          const oldConn = oldFlow?.connections[connId];
          flow.connections[connId] = {
            ...newFlow.connections[connId],
            visible: oldConn ? oldConn.visible : 0,
          };
        }

        //merge ports
        flow.ports = {};
        for (const portId in newFlow.ports) {
          const oldPort = oldFlow?.ports[portId];
          flow.ports[portId] = {
            ...newFlow.ports[portId],
            pos: oldPort
              ? oldPort.pos
              : {
                  x: 0,
                  y: 0,
                },
          };
        }

        // merge nodes
        flow.drawflow = {};
        for (const nodeId in newFlow.drawflow) {
          const newNode = newFlow.drawflow[nodeId];
          const oldNode = oldFlow?.drawflow[nodeId];
          const node = (flow.drawflow[nodeId] = {
            ...getDefaultFlowNode(),
          });
          lodash.merge(node, oldNode ?? {});
          lodash.merge(node, newNode);
        }
      }
      console.log({ newFlows });
      state.flows = newFlows;
    })
    .addCase(stateReplaceAll, (state, { payload }) => {
      const strState = payload.reduce((acc, next) => {
        return acc.replaceAll(next[0], next[1]);
      }, JSON.stringify(state));
      return JSON.parse(strState);
    })

    // reducer for drawflow
    .addMatcher(
      (action) => action.type.startsWith(Slices.Drawflow),
      (state, action) => {
        state.flows[state.version] = drawflowSlice(
          state.flows[state.version],
          action
        );
      }
    );
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.subscribe(() => console.log(store.getState()))
