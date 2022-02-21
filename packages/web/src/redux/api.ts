import { createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql-request";
import { graphqlUri } from "../graphql/apollo";

const urlParams = new URLSearchParams(window.location.search);
export const botFlowId = Number(urlParams.get("botFlowId"));

const client = new GraphQLClient(graphqlUri);
export const sdk = getSdk(client);

export const corsUrl =
  import.meta.env.VITE_CORS_PATH ?? "http://localhost:8080/";

const apiUrl =
  import.meta.env.VITE_TASTY_POINTS_API ??
  "https://tastypoints.io/akm/restapi.php";
const baseUrl = corsUrl + apiUrl;

export const getFileUrl = async (file: File) => {
  // Upload file to server
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
