import { undoRedoActionType } from "./undoRedo";
import { drawflow } from "./node.types";
import { Port, ports } from "./port.types";
import { clientPos, pos } from "./helpers";
import { connections } from "./connection.types";
import { portType } from "../spacing";

export type select = {
  type: portType | "node" | "path";
  selectId: number;
};

export interface stateData {
  isDraft: boolean;
  live: boolean;
  canvasDrag: boolean;
  config: {
    drag: boolean;
    canvasTranslate: pos;
    zoom: {
      value: number;
      max: number;
      min: number;
      tick: number;
    };
  };
  undoRedoActions: Array<undoRedoActionType>;
  drawflow: drawflow;
  modalType: string | null;
  newPathDirection: clientPos | null;
  ports: ports;
  connections: connections;
  select: select | null;
  editLock: boolean;
  mouseBlockDragPos: clientPos | null;
  portToConnect: Port | null;
  nodeToCopyId: number | null;
  clientCurrentMousePos: clientPos | null;
}
