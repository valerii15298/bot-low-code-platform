import { PayloadAction } from "@reduxjs/toolkit";
import { drawflow } from "./node.types";
import { ports } from "./port.types";
import { connections } from "./connection.types";
import { RecursivePartial } from "./helpers";

export interface ProcessEntitiesType<T extends Record<string | number, any>> {
  add: Array<T[keyof T]>;
  remove: Array<keyof T>;
  update: T;
}

export interface ProcessEntitiesPayload {
  connections: ProcessEntitiesType<connections>;
  drawflow: ProcessEntitiesType<drawflow>;
  ports: ProcessEntitiesType<ports>;
}

export type ProcessEntitiesPayloadPartial = RecursivePartial<
  ProcessEntitiesPayload,
  2
>;

export interface processEntitiesAction {
  type: string;
  live: boolean;
  undo: ProcessEntitiesPayload;
  redo: ProcessEntitiesPayloadPartial;
}

// TODO make union in future for other undoRedoAction types
export type undoRedoActionType = processEntitiesAction;

export type UndoablePayload<T> = PayloadAction<{
  data: T;
  pushToUndoRedo?: boolean;
}>;

export type UndoableEntitiesPayload =
  UndoablePayload<ProcessEntitiesPayloadPartial>;
