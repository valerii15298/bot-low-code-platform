import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectActiveDrawflow } from "../drawflowSlice";
import { flowType } from "../../types/reduxStoreState";

export const undoThunk = createAsyncThunk(
  "undoThunk",
  (
    { server }: { server: boolean } | undefined = { server: true },
    { getState, dispatch }
  ) => {
    const state = selectActiveDrawflow(getState() as flowType);
    const { actions, currentIndex } = state.undoRedo;
    // default will be -1, current index will point to last did action
    if (currentIndex < 0) return;
    const lastAction = actions[currentIndex];
    if (!lastAction) {
      throw new TypeError("last action undefined");
    }
    /*
     * There are two cases:
     * 1: action was performed in live mode
     * 2: action was performed in draft mode and flow is not yet committed
     * Also we cannot undo in flow which is already committed(e. g. is not draft or live mode)
     * */

    const { live, isDraft } = state;
    if (!live && !isDraft) {
      alert("To undo flow must be either a draft or in live mode");
      return;
    }

    if (lastAction.live && !live) {
      alert("Fail! You need to enable live mode to undo this action");
      return;
    }

    // 1: just undo
    // 2: undo and send request to server if fail: redo

    if (lastAction) {
      const payload = {
        data: lastAction.undo,
        pushToUndoRedo: false,
      };
      dispatch({ type: lastAction.type, payload });
      if (lastAction.live && server === true) {
        const serverType = lastAction.type.split("/")[0];
        // TODO find server action by type
        // eslint-disable-next-line no-inner-declarations,@typescript-eslint/no-empty-function
        async function serverAction() {}

        serverAction()
          .then(console.log, console.error)
          .catch(() => {
            console.log(
              "Fail, cannot connect with server, consider turn off live mode and make changes locally"
            );
            const payload = {
              data: lastAction.redo,
              pushToUndoRedo: false,
            };
            dispatch({ type: lastAction.type, payload });
          });
      }
    }
  }
);
