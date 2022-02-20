import { stateData } from "../types/currentBotFlowVersion";

export const getDefaultStateData = (): stateData => ({
  clientCurrentMousePos: null,
  mouseBlockDragPos: null,
  nodeToCopyId: null,
  undoRedoActions: [],
  isDraft: false,
  live: false,
  canvasDrag: false,
  config: {
    drag: false,
    canvasTranslate: {
      x: 0,
      y: 0,
    },
    zoom: {
      value: 1,
      max: 2,
      min: 0.5,
      tick: 0.1,
    },
  },
  drawflow: {},
  connections: {},
  ports: {},
  select: null,
  newPathDirection: null,
  modalType: null,
  editLock: false,
  portToConnect: null,
});
