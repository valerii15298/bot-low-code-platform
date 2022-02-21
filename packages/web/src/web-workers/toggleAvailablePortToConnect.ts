import { Flow } from "../redux/Flow";
import { stateData } from "../types/currentBotFlowVersion";
import { idBotFlowVersionType } from "../types/botFlow.types";

let running = false;

onmessage = ({
  data: [state, version],
}: {
  data: [stateData, idBotFlowVersionType];
}) => {
  if (running) {
    return;
  }
  running = true;
  if (state.config.drag && state.select) {
    const flow = new Flow(state);
    flow.toggleAvailablePortToConnect(state.select.selectId);
    const { portToConnect } = flow.state;
    postMessage({
      portToConnect,
      version,
    });
  }
  running = false;
};
