import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { FC } from "react";
import introspectionQueryResultData from "../fragmentTypes";
import { typeDefs } from "../local-schema";
import React from "react";

export const cache = new InMemoryCache({
  possibleTypes: introspectionQueryResultData.possibleTypes,
});

// TODO use only env var, and do not depend on prod or dev here
export const graphqlUri =
  (import.meta.env.PROD && import.meta.env.VITE_GRAPHQL_API_PATH) ||
  "http://localhost:3000/graphql";

export const apolloClient = new ApolloClient({
  uri: graphqlUri,
  cache,
  typeDefs: [typeDefs],
});

export default (({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}) as FC;
