import { createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql-request";
import {
  actions,
  canvasMouseUp,
  processEntities,
  selectActiveDrawflow,
} from "./drawflowSlice";
import { Flow } from "./Flow";
import { graphqlUri } from "../graphql/apollo";
import { setStateAction, updateConnectionsIds } from "./actions";
import { getId } from "./getId";
import { copyStateData } from "./copyStateData";
import { portType } from "../spacing";
import { stateData } from "../types/currentBotFlowVersion";
import { flowType } from "../types/reduxStoreState";
import { idFlowNodeType, node } from "../types/node.types";
import { idPortType, Port } from "../types/port.types";
import { connection, idConnType } from "../types/connection.types";
import { exclude } from "../models/tools";

const urlParams = new URLSearchParams(window.location.search);
export const botFlowId = Number(urlParams.get("botFlowId"));

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client = new GraphQLClient(graphqlUri!);
export const sdk = getSdk(client);

export const fetchBotFlow = createAsyncThunk("fetchBotFlow", async () => {
  const data = await sdk.botFlow({ where: { id: botFlowId } });
  const arr = data.botFlow?.versions.map((ver) => {
    const ports: Record<idPortType, Omit<Port, "pos">> = {};
    const drawflow = ver.nodes.reduce((acc, v) => {
      acc[v.id] = v;
      v.ports.forEach(
        ({ id, index }) =>
          (ports[id] = {
            id,
            type: index === 1 ? portType.in : portType.out,
            nodeId: v.id,
            portId: index - Number(index !== 1),
          })
      );
      return acc;
    }, {} as Record<idFlowNodeType, Pick<node, "id" | "NodeProps" | "info">>);
    const connections = ver.connections.reduce((acc, v) => {
      acc[v.id] = {
        ...v,
      };
      return acc;
    }, {} as Record<idConnType, Omit<connection, "visible">>);
    return [
      ver.id,
      {
        drawflow,
        ports,
        connections,
      },
    ] as const;
  });
  if (!arr) return;
  // console.log({ arr });
  return Object.fromEntries(arr);
});

export const corsUrl =
  import.meta.env.VITE_CORS_PATH ?? "http://localhost:8080/";

const apiUrl =
  import.meta.env.VITE_TASTY_POINTS_API ??
  "https://tastypoints.io/akm/restapi.php";
const baseUrl = corsUrl + apiUrl;

export const getFileUrl = async (file: File) => {
  /*Upload file to server
   * */
  const formData = new FormData();
  formData.append("profile_picture", file);
  const response = await fetch(
    `${corsUrl}${import.meta.env.VITE_TASTY_POINTS_API_UPLOAD_FILE}`,
    {
      method: "POST",
      body: formData,
    }
  );
  // console.log(await response.text());
  const { link } = (await response.json()) as { link: string };
  return link;
};

export enum REQUEST_TYPE {
  getTemplateNodes = 1156,
  postTemplateNodes = 1157,
  getFlowDataVersion = 1160,
  postFlowDataVersion = 1161,
  getFlow = 1162,
  postFlow = 1163,
  fetchBackgroundImages = 1164,
  getGroups = 1154,
  postGroups = 1155,
  getStepSettingsTemplates = 1222,
}

export const request = async (
  scrdata_id: REQUEST_TYPE,
  data: Record<string, unknown> = {}
): Promise<any> => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const session_id = urlParams.get("session_id");

  if (!session_id) {
    console.error("session_id is not provided!");
    alert("session_id is not provided!");
  }

  const data_json = {
    session_id,
    sp_name: "OK",
    session_exp: "2021-02-12T02:57:45.453422",
    status: "OK",
    item_id: 0,
    max_row_per_page: 50,
    search_term: "",
    search_term_header: "",
    pagination: 1,
    scrdata_id,
    ...data,
  };

  return fetch(baseUrl, {
    method: "post",
    body: JSON.stringify({ input: data_json }).replace(/'/g, "''"),
  }).then(async (resp) => {
    let json = await resp.json();
    // console.log(json);
    if (json.status && json.data) {
      json = JSON.parse(json.data);
    } else {
      console.error(json);
      alert(json);
      alert(JSON.stringify(json, null, 2));
      throw new Error(json);
    }
    if (json.response_error) {
      console.error(json.response_error);
      alert(JSON.stringify(json.response_error, null, 2));
      throw new Error(json.response_error);
    }
    if (json.status !== "OK" && json.sp_name !== "OK") {
      alert(JSON.stringify(json, null, 2));
      throw new Error(json.response_error);
    }
    return json;
  });
};

export const postFlow = createAsyncThunk("postFlow", () => {
  console.log("postFlow");
});

export const commitFlowVersionThunk = createAsyncThunk(
  "commitFlowVersionThunk",
  (_, { getState }) => {
    console.log("commitFlowVersion");
    const appState = getState() as flowType;
    const { connections, ports, drawflow } = selectActiveDrawflow(appState);
    sdk
      .commitBotFlowVersion({
        botFlowId,
        connections: Object.values(connections).map((conn) => ({
          id: conn.id,
          botFlowVersionId: appState.version,
          from: conn.fromPort.id,
          to: conn.toPort.id,
        })),
        nodes: Object.values(drawflow).map(({ info, NodeProps }) => {
          const { type } = NodeProps;
          const propsKey = `Node${type}Props` as const;
          const props = NodeProps[propsKey];
          return {
            flow: { connect: { id: appState.version } },
            info: { create: exclude(info, "id") },
            NodeProps: {
              create: {
                type: NodeProps.type,
                [propsKey]: { create: props },
              },
            },
            ports: {
              createMany: {
                data: Object.values(ports).map((port) => ({
                  id: port.id,
                  index: port.portId + Number(port.type === portType.out),
                })),
              },
            },
          };
        }),
      })
      .then(() => alert("Commited successfully"))
      .catch((err) => console.log({ err }));
  }
);

export const addConnection = createAsyncThunk("addConnection", (ss) => {
  console.log("addConnection");
});

export const removeConnection = createAsyncThunk("removeConnection", () => {
  console.log("removeConnection");
});

export const addFlowNode = createAsyncThunk("addFlowNode", () => {
  console.log("addFlowNode");
});

export const removeFlowNode = createAsyncThunk("removeFlowNode", () => {
  console.log("removeFlowNode");
});

export const updateFlowNode = createAsyncThunk("updateFlowNode", () => {
  console.log("updateFlowNode");
});

export const undoThunk = createAsyncThunk(
  "undoThunk",
  (_, { getState, dispatch }) => {
    const state = selectActiveDrawflow(getState() as flowType);
    const lastAction = state.undoRedoActions.at(-1);
    if (lastAction) {
      dispatch(
        actions[lastAction.type]({
          data: lastAction.undo,
          pushToUndoRedo: false,
        })
      );
    }
  }
);

// export const processConnectionsServer = createAsyncThunk(
//   "processConnectionsServer",
//   (connections: processConnections) => {
//
//   }
// );

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
            add: addWithIds.map(({ fromPort, toPort, id }) => ({
              id, // here use id only as client id,
              // actual ids will be generated on serer side
              from: fromPort.id,
              to: toPort.id,
              botFlowVersionId: appState.version,
            })),
            remove: { where: { id: { in: conns.remove } } },
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
            console.trace(err);
            console.log(
              "Changes are not saved to the server, continue changes locally"
            );
            dispatch(undoThunk());
          });
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
