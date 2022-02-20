import { getDefaultStateData } from "./getDefaultStateData";
import { mainWindow, sideWindow } from "../spacing";
import { flowType } from "../types/reduxStoreState";

export const getFlowInitialState = (): flowType => ({
  canvas: null,
  precanvas: null,
  sidebarVisible: true,
  dragTemplate: null,
  version: 0,
  flows: { 0: getDefaultStateData() },
  windowConfig: {
    id: 0,
    mainId: mainWindow.mainFlow,
    sideId: sideWindow.none,
    background: {
      opacity: 0,
      blur: 0,
      imageUrl: "",
    },
  },
});
