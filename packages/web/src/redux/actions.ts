import { createAction } from "@reduxjs/toolkit";
import { canvasShape, clientPos, RecursivePartial } from "../types/helpers";
import { flowType } from "../types/reduxStoreState";
import { pureTemplateNode } from "../types/node.types";

export const addNewNode = createAction<
  clientPos & { templateNode: pureTemplateNode }
>("addNewNode");
export const canvasShapeUpdated =
  createAction<canvasShape>("canvasShapeUpdated");
export const insertCopiedNode = createAction("insertCopiedNode");
export const toggleSidebar = createAction("toggleSidebar");
export const setStateAction =
  createAction<RecursivePartial<flowType>>("setState");
export const stateReplaceAll =
  createAction<Array<[string, string]>>("stateReplaceAll");
export const updateConnectionsIds = createAction<{
  mapClientIdToServerId: Record<number, number>;
  flowVersion: number;
}>("updateConnectionsIds");
