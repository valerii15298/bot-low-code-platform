import { getId } from "./getId";
import { getDefaultStateData } from "../models/getDefaultStateData";
import { stateData } from "../types/currentBotFlowVersion";
import { drawflow } from "../types/node.types";
import { ports } from "../types/port.types";
import { connections } from "../types/connection.types";

export const copyStateData = (state: stateData): stateData => {
  // assume state is already copied, via something like JSON.parse(JSON.stringify(...))

  const { drawflow, ports, connections } = state;
  const oldState = { drawflow, ports, connections };

  // const changedIds = ObjectKeys(toCopy).reduce((prevState, nextKey) => {
  //   return Object.values(state[nextKey]).reduce((acc, entity) => {
  //     return acc.replaceAll(entity.id.toString(), getId().toString());
  //   }, prevState);
  // }, oldState);

  // const changedPortIds = Object.values(state.ports).reduce(
  //   (acc, port) => {
  //     return acc.replaceAll(port.id.toString(), getId().toString());
  //   },
  //   oldState
  // );
  // const changedNodeIds = Object.values(state.drawflow).reduce(
  //   (acc, node) => {
  //     return acc.replaceAll(node.id.toString(), getId().toString());
  //   },
  //   changedPortIds
  // );
  //
  // const changedConnIds = Object.values(state.connections).reduce(
  //   (acc, conn) => {
  //     return acc.replaceAll(conn.id.toString(), getId().toString());
  //   },
  //   changedNodeIds
  // );

  // const newState = JSON.parse(changedIds) as typeof toCopy;

  // change node ids
  // change conn ids
  // change port ids

  oldState.connections = Object.values(oldState.connections).reduce(
    (acc, conn) => {
      const newId = getId();
      return { ...acc, [newId]: { ...conn, id: newId } };
    },
    {} as connections
  );

  oldState.ports = Object.values(oldState.ports).reduce(
    (acc, { id, ...port }) => {
      const newId = getId();
      Object.values(oldState.connections).forEach((conn) => {
        if (conn.toPort.id === id) {
          conn.toPort.id = newId;
        }
        if (conn.fromPort.id === id) {
          conn.fromPort.id = newId;
        }
      });
      return { ...acc, [newId]: { ...port, id: newId } };
    },
    {} as ports
  );

  oldState.drawflow = Object.values(oldState.drawflow).reduce(
    (acc, { id, ...node }) => {
      const newId = getId();
      Object.values(oldState.ports).forEach((port) => {
        if (port.nodeId === id) {
          port.nodeId = newId;
        }
      });
      return { ...acc, [newId]: { ...node, id: newId } };
    },
    {} as drawflow
  );
  return { ...state, ...oldState };
};
