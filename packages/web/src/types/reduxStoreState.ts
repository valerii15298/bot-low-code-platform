import { stateData } from "./currentBotFlowVersion";
import { mainWindow, sideWindow } from "../spacing";
import { idBotFlowVersionType } from "./botFlow.types";
import { idFlowNodeType } from "./node.types";
import { canvasShape } from "./helpers";

export interface flowType {
  dragTemplate: idFlowNodeType | null;
  version: idBotFlowVersionType;
  flows: Record<idBotFlowVersionType, stateData>;
  canvas: canvasShape | null;
  precanvas: canvasShape | null;
  sidebarVisible: boolean;
  windowConfig: {
    id: number;
    mainId: mainWindow;
    sideId: sideWindow;
    background: {
      opacity: number;
      blur: number;
      imageUrl: string;
    };
  };
}
