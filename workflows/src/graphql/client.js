import { ApolloClient, InMemoryCache } from "@apollo/client/core/core.cjs";
import { ApolloLink } from "@apollo/client/link/core/core.cjs";
import { HttpLink } from "@apollo/client/link/http/HttpLink.js";
import { onError } from "@apollo/client/link/error/error.cjs";
import { setContext } from "@apollo/client/link/context/context.cjs";
import fetch from "node-fetch";

function createAuthenticatedApolloClient(uri, getToken) {
  if (!uri) {
    throw new Error(
      "Cannot make request to GraphQL API, missing `uri` argument"
    );
  }

  const authLink = setContext(async (request, { headers }) => {
    let accessToken;

    if (getToken) {
      accessToken = await getToken();
    }

    return {
      headers: {
        ...headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions: { serviceName }, message, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Service: ${serviceName}, Path: ${path[0]}`
        )
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, authLink, new HttpLink({ fetch, uri })]),
    name: "Workflows Subgraph",
    version: "1.0"
  });
}

export default createAuthenticatedApolloClient;
