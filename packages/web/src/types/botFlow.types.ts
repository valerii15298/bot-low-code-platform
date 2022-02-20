import { BotFlowQuery } from "../generated/graphql-request";

export type botFlow = Exclude<BotFlowQuery["botFlow"], null | undefined>;
export type versions = botFlow["versions"];
export type idBotFlowVersionType = versions[number]["id"];
