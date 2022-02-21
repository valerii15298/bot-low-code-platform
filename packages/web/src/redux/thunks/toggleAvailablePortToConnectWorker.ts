import { createAsyncThunk } from "@reduxjs/toolkit";
import TogglePortWorker from "../../web-workers/toggleAvailablePortToConnect?worker";
import { actions, selectActiveDrawflow } from "../drawflowSlice";
import { store } from "../store";
import { flowType } from "../../types/reduxStoreState";
import { idBotFlowVersionType } from "../../types/botFlow.types";
import { Port } from "../../types/port.types";

const togglePortWorker = new TogglePortWorker();
togglePortWorker.onmessage = ({
  data,
}: {
  data: {
    portToConnect: Port;
    version: idBotFlowVersionType;
  };
}) => {
  const { version } = store.getState();
  if (version === data.version) {
    store.dispatch(actions.setState({ portToConnect: data.portToConnect }));
  }
};

export const toggleAvailablePortToConnectThunk = createAsyncThunk(
  "toggleAvailablePortToConnect",
  async (_, { getState }) => {
    const appState = getState() as flowType;
    const { version } = appState;
    const state = selectActiveDrawflow(appState);
    togglePortWorker.postMessage([state, version]);
  }
);
