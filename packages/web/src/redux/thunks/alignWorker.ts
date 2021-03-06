import { createAsyncThunk } from "@reduxjs/toolkit";
import { actions, selectActiveDrawflow } from "../drawflowSlice";
import { store } from "../store";
import AlignWorker from "../../web-workers/alignFlow?worker";
import { flowType } from "../../types/reduxStoreState";

const alignWorker = new AlignWorker();
alignWorker.onmessage = (m: any) => {
  const { version } = store.getState();
  if (version === m.data.version) {
    // TODO use with web workers, only change positions of nodes,
    // lane, positionNumber, etc...
    store.dispatch(actions.setState({ drawflow: m.data.drawflow }));
  }
};

export const alignCurrentFlow = createAsyncThunk(
  "alignCurrentFlow",
  async (_, { getState }) => {
    const appState = getState() as flowType;
    const { version } = appState;
    const { drawflow, ports, connections } = selectActiveDrawflow(appState);
    alignWorker.postMessage([
      {
        drawflow,
        ports,
        connections,
      },
      version,
    ]);
  }
);
