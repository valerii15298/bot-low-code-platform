import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  actions,
  processEntities,
  selectActiveDrawflow,
} from "../drawflowSlice";
import { setStateAction } from "../actions";
import { copyStateData } from "../copyStateData";
import { getId } from "../getId";
import { sdk } from "../api";
import { stateData } from "../../types/currentBotFlowVersion";
import { flowType } from "../../types/reduxStoreState";
import { undoThunk } from "./undoThunk";

export const removeActiveConnectionThunk = createAsyncThunk(
  "removeActiveConnection",
  (_, { dispatch, getState }) => {
    const state = selectActiveDrawflow(getState() as flowType);
    const { select } = state;
    if (select?.type === "path") {
      // delete state.connections[select.selectId];
      const connsWithIds = { add: [], remove: [select.selectId] };
      if (state.isDraft || state.live) {
        dispatch(
          actions.processEntities({
            data: { connections: connsWithIds },
            pushToUndoRedo: true,
          })
        );
      }
      if (state.live) {
        console.log("Is live");
        sdk
          .processConnections({
            add: [],
            remove: { where: { id: { in: connsWithIds.remove } } },
          })
          .then((data) => {
            console.log("success");
          })
          .catch((err) => {
            console.trace(err);
            console.log(
              "Changes are not saved to the server, continue changes locally"
            );
            dispatch(undoThunk());
          });
      } else if (!state.isDraft) {
        console.log("not draft and not live");
        // if state is locked(e. g. already commited)
        // need create new draft
        const copiedOldState = JSON.parse(JSON.stringify(state)) as stateData;
        // console.log({ copiedOldState });
        processEntities(copiedOldState, {
          payload: { data: { connections: connsWithIds } },
          type: "processConnections",
        });
        dispatch(actions.setState({ select: null }));
        const copiedNewState = copyStateData(copiedOldState);
        const newFlowVersionId = getId();
        // console.log({ newFlowVersionId });
        dispatch(
          setStateAction({
            version: newFlowVersionId,
            flows: { [newFlowVersionId]: { ...copiedNewState, isDraft: true } },
          })
        );
      }
    }
  }
);
