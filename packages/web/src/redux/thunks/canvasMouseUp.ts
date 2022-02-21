import { createAsyncThunk } from "@reduxjs/toolkit";
import { flowType } from "../../types/reduxStoreState";
import {
  actions,
  canvasMouseUp,
  processEntities,
  selectActiveDrawflow,
} from "../drawflowSlice";
import { Flow } from "../Flow";
import { connection, connections } from "../../types/connection.types";
import { getId } from "../getId";
import { setStateAction, updateConnectionsIds } from "../actions";
import { stateData } from "../../types/currentBotFlowVersion";
import { copyStateData } from "../copyStateData";
import { sdk } from "../api";
import { ProcessEntitiesType } from "../../types/undoRedo";
import { undoThunk } from "./undoThunk";

export const processConnectionsThunk = createAsyncThunk(
  "processConnectionsThunk",
  (
    conns: Partial<ProcessEntitiesType<connections>>,
    { dispatch, getState }
  ) => {
    // take only connections
    const appState = getState() as flowType;
    sdk

      .processConnections({
        add:
          conns.add?.map(({ fromPort, toPort, id }) => ({
            id, // here use id only as client id,
            // actual ids will be generated on serer side
            from: fromPort.id,
            to: toPort.id,
            botFlowVersionId: appState.version,
          })) ?? [],
        remove: { where: { id: { in: conns.remove ?? [] } } },
      })
      .then((data) => {
        const { added } = data.processConnections;
        const mapClientIdToServerId = added.reduce((prev, next) => {
          return { ...prev, [next.clientId]: next.id };
        }, {} as Record<number, number>);
        dispatch(
          updateConnectionsIds({
            mapClientIdToServerId,
            flowVersion: appState.version,
          })
        );
      })
      .catch((err) => {
        // TODO onfail
        console.trace(err);
        console.log(
          "Changes are not saved to the server, continue changes locally"
        );
        dispatch(undoThunk());
      });
  }
);

export const canvasMouseUpThunk = createAsyncThunk(
  "canvasMouseUpThunk",
  async (_, { dispatch, getState }) => {
    const appState = getState() as flowType;
    dispatch(actions.canvasMouseUp());
    const state = selectActiveDrawflow(appState);
    const flow = new Flow(state);
    if (state.portToConnect && state.select?.selectId) {
      const { id } = state.portToConnect;
      const endId = state.select.selectId;
      const conns = flow.addConnection({
        visible: 0,
        fromPort: {
          id,
        },
        toPort: {
          id: flow.getNode(endId).inPort.id,
        },
      });
      const addWithIds: connection[] = conns.add.map((conn) => ({
        ...conn,
        id: getId(),
        visible: 0,
      }));
      const connsWithIds = {
        ...conns,
        add: addWithIds,
      };

      if (state.isDraft || state.live) {
        dispatch(
          actions.processConnections({
            data: { connections: connsWithIds },
            pushToUndoRedo: true,
          })
        );
      }
      if (state.live) {
        console.log("Is live");
        dispatch(processConnectionsThunk(connsWithIds));
      } else {
        console.log("not draft and not live");
        // if state is locked(e. g. already commited)
        // need create new draft
        // console.log({ connsWithIds });
        const copiedOldState = JSON.parse(JSON.stringify(state)) as stateData;
        // console.log({ copiedOldState });
        processEntities(copiedOldState, {
          payload: { data: { connections: connsWithIds } },
          type: "processConnections",
        });
        canvasMouseUp(copiedOldState);
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
      /* check if in live mode mode
       if in live mode then:
       process conns:
       delete conns, add generated ids to new ones,
      insert into state new ones,
       send to server as transactions,
       if fail on server then:
          show error,
          keep local, stop merging,
          push into queue to process as transaction
          and push to server later when will be online*/
    }
  }
);

const key = "id";

const mf = (k: any) => (arr: any[]) => arr.map((item) => item[k]);

const sel = (user: any) => user[key];
// const prop = (key) = (obj) => obj[key]

const f1 = (users: any[]) => users.map(sel);
