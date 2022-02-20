import { versions } from "./botFlow.types";

export type connection = versions[number]["connections"][number] & {
  visible: number;
};
export type idConnType = connection["id"];
export type addConnectionType = Omit<connection, "id">;
export type connections = Record<idConnType, connection>;
