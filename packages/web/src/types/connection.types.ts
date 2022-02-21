import { versions } from "./botFlow.types";

export type pureConnection = versions[number]["connections"][number];
export type connection = pureConnection & {
  visible: number;
};
export type idConnType = connection["id"];
export type addConnectionType = Omit<connection, "id">;
export type connections = Record<idConnType, connection>;
