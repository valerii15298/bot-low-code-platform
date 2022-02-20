import { PayloadAction } from "@reduxjs/toolkit";
import lodash from "lodash";
import { ObjectKeys } from "../types/helpers";

export const setState = (
  state: Record<string, any>,
  { payload, type }: PayloadAction<Record<string, any>>
) => {
  lodash.merge(state, payload);
  // console.log({ payload, type, state });
};
