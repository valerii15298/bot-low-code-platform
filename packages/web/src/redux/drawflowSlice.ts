import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Flow } from "./Flow";
import type { RootState } from "./store";
import { getDefaultStateData } from "../models/getDefaultStateData";
import { setState } from "./setState";
import { portType, Slices } from "../spacing";
import { clientPos, pos, RecursivePartial } from "../types/helpers";
import { select, stateData } from "../types/currentBotFlowVersion";
import { moveNodeType } from "../types/node.types";
import {
  ProcessEntitiesPayload,
  UndoableEntitiesPayload,
} from "../types/undoRedo";

export const getDefaultEntitiesDataToProcess = () => ({
  add: [],
  remove: [],
  update: [],
});

export const getDefaultProcessEntitiesPayload = (): ProcessEntitiesPayload => ({
  connections: getDefaultEntitiesDataToProcess(),
  drawflow: getDefaultEntitiesDataToProcess(),
  ports: getDefaultEntitiesDataToProcess(),
});

export const processEntities = (
  state: stateData,
  { payload: { data, pushToUndoRedo }, type }: UndoableEntitiesPayload
) => {
  const { connections, ports, drawflow } = data;
  const undo = getDefaultProcessEntitiesPayload();

  //handle nodes
  drawflow?.remove?.forEach((nodeId) => {
    undo.drawflow.add.push(state.drawflow[nodeId]);
    delete state.drawflow[nodeId];
  });
  drawflow?.add?.forEach((node) => (state.drawflow[node.id] = node));
  undo.drawflow.remove = drawflow?.add?.map(({ id }) => id) ?? [];

  //handle ports
  ports?.remove?.forEach((id) => {
    undo.ports.add.push(state.ports[id]);
    delete state.ports[id];
  });
  ports?.add?.forEach((port) => (state.ports[port.id] = port));
  undo.ports.remove = ports?.add?.map(({ id }) => id) ?? [];

  // handle connections
  connections?.remove?.forEach((connId) => {
    undo.connections.add.push(state.connections[connId]);
    delete state.connections[connId];
  });
  connections?.add?.forEach((conn) => (state.connections[conn.id] = conn));
  undo.connections.remove = connections?.add?.map(({ id }) => id) ?? [];

  if (pushToUndoRedo) {
    state.undoRedo.actions.push({
      type,
      undo,
      redo: data,
      live: state.live,
    });
    state.undoRedo.currentIndex++;
  }

  new Flow(state).alignAll();
};

export const canvasMouseUp = (state: stateData) => {
  state.portToConnect = null;
  state.newPathDirection = null;
  state.canvasDrag = false;
  state.config.drag = false;
  if (state.select?.type === portType.out) {
    state.select = null;
  }
};

export const initialState: stateData = getDefaultStateData();

const slice = createSlice({
  name: Slices.Drawflow,
  initialState,
  reducers: {
    setState: (
      state: stateData,
      action: PayloadAction<RecursivePartial<stateData>>
    ) => setState(state, action),
    setEditLock: (state, { payload }: PayloadAction<boolean>) => {
      state.editLock = payload;
    },
    moveNode: (state, action: PayloadAction<moveNodeType>) => {
      // state = JSON.parse(JSON.stringify(state));
      new Flow(state).moveNode(action.payload);
      // return state;
    },
    setMouseBlockDragPos: (
      state: stateData,
      { payload }: PayloadAction<clientPos>
    ) => {
      state.mouseBlockDragPos = payload;
    },
    unSelect: (state) => {
      state.config.drag = false;
      state.select = null;
    },
    select: (state, { payload, type }: PayloadAction<select>) => {
      state.config.drag = payload.type === "node";
      state.select = payload;
      console.log({ type });
    },
    selectPort: (state, { payload: { id } }: PayloadAction<{ id: number }>) => {
      const port = state.ports[id];
      if (!port) {
        throw new TypeError("Cannot find port to select in state.ports");
      }
      const selectId = port.id;
      state.select = {
        type: port.type,
        selectId,
      };
    },
    moveCanvas: (
      state,
      {
        payload: { movementX, movementY },
      }: PayloadAction<{ movementX: number; movementY: number }>
    ) => {
      if (state.canvasDrag) {
        state.config.canvasTranslate.x += movementX;
        state.config.canvasTranslate.y += movementY;
      }
    },
    canvasDrag: (state, { payload }: PayloadAction<boolean>) => {
      state.canvasDrag = payload;
    },
    canvasMouseMove: (
      state,
      {
        payload: { movementX, movementY, clientX, clientY },
      }: PayloadAction<{
        clientX: number;
        clientY: number;
        movementX: number;
        movementY: number;
      }>
    ) => {
      // state = JSON.parse(JSON.stringify(state));
      state.clientCurrentMousePos = {
        clientX,
        clientY,
      };
      // return undefined
      if (state.canvasDrag) {
        state.config.canvasTranslate.x += movementX;
        state.config.canvasTranslate.y += movementY;
        // console.log('Drag canvas')
      } else if (state.select?.type === portType.out) {
        state.newPathDirection = {
          clientX,
          clientY,
        };
        // console.log('New path')
      } else if (state.config.drag && state.select) {
        // move node
        // console.log('Move node')
        const nodeId = state.select.selectId;
        const { clientX: prevX, clientY: prevY } =
          state.mouseBlockDragPos as clientPos;
        state.mouseBlockDragPos = {
          clientX,
          clientY,
        };
        const coef = state.config.zoom.value;
        const dx = (clientX - prevX) / coef;
        const dy = (clientY - prevY) / coef;

        state.drawflow[nodeId].pos.x += dx;
        state.drawflow[nodeId].pos.y += dy;
        const flow = new Flow(state);
        flow.untieNodeIfFarAway(nodeId);
        flow.toggleAvailablePortToConnect(nodeId);
      }
    },
    alignCurrentFlow: (state) => {
      new Flow(state).alignAll();
    },
    canvasMouseUp,
    processEntities,
    processConnections: (state, action: UndoableEntitiesPayload) => {
      processEntities(state, action);
    },
    processFlowNodes: (state, action: UndoableEntitiesPayload) => {
      processEntities(state, action);
    },

    portMouseUp: (
      state,
      { payload: { id } }: PayloadAction<{ id: number }>
    ) => {
      const { select } = state;
      const portTo = state.ports[id];
      if (!portTo) {
        throw new TypeError("Port not found!!");
      }

      if (portTo.type !== portType.in || !select) return;
      if (select.type !== portType.out) {
        return;
      }
      const port = state.ports[select.selectId];

      if (!port) {
        throw new TypeError("Port not found!!");
      }

      // if connect to same node
      if (port.id === portTo.id) return;

      const flow = new Flow(state);
      flow.addConnection({
        visible: 0,
        fromPort: {
          id: select.selectId,
        },
        toPort: {
          id: portTo.id,
        },
      });
    },
    clear: () => initialState,
    pushPort: (
      state: stateData,
      { payload: { id, pos } }: PayloadAction<{ id: number; pos: pos }>
    ) => {
      // console.log(...Object.values(pos), id);
      state.ports[id].pos = pos;
    },
    zoom: (state, { payload }: PayloadAction<boolean | null>) => {
      const { zoom } = state.config;
      const { value, max, min, tick } = zoom;
      const newValue = value + (payload ? tick : -tick);
      if (newValue <= max && newValue >= min) {
        zoom.value = newValue;
      }
      if (payload === null) {
        state.config.canvasTranslate = {
          x: 0,
          y: 0,
        };
        zoom.value = 1;
      }
    },
    nodeSize: (
      state,
      {
        payload: { height, width, id },
      }: PayloadAction<{ id: number; height: number; width: number }>
    ) => {
      state.drawflow[id].height = height;
      state.drawflow[id].width = width;
    },
    toggleSubnodes: (
      state,
      { payload: { id } }: PayloadAction<{ id: number }>
    ) => {
      // state = JSON.parse(JSON.stringify(state));
      const flow = new Flow(state);
      const node = flow.getNode(id);
      node.toggleSubnodesVisibility();
      // return flow.state;
    },
    toggleChildren: (
      state,
      { payload: { id } }: PayloadAction<{ id: number }>
    ) => {
      // state = JSON.parse(JSON.stringify(state));
      const flow = new Flow(state);
      const node = flow.getNode(id);
      node.toggleChildrenVisibility();
      // return flow.state;
    },
    copyNode: (state) => {
      if (state.select?.type === "node") {
        state.nodeToCopyId = state.select.selectId;
      }
    },
  },
});

export const actions = slice.actions;
export const drawflowSlice = slice.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectActiveDrawflow = (state: RootState) =>
  state.flows[state.version];
