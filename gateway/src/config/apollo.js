import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource
} from "@apollo/gateway";
import { ApolloError, ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import depthLimit from "graphql-depth-limit";

function initGateway(httpServer) {
  const gateway = new ApolloGateway({
    // This is only used when running the gateway in unmanaged mode
    // supergraphSdl: new IntrospectAndCompose({
    //   subgraphs: [
    //     { name: "accounts", url: process.env.ACCOUNTS_ENDPOINT },
    //     { name: "profiles", url: process.env.PROFILES_ENDPOINT },
    //     { name: "bookmarks", url: process.env.BOOKMARKS_ENDPOINT },
    //     { name: "workflows", url: process.env.WORKFLOWS_ENDPOINT }
    //   ],
    //   pollIntervalInMs: 1000
    // }),
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        apq: true,
        url,
        willSendRequest({ request, context }) {
          request.http.headers.set(
            "user",
            context.user ? JSON.stringify(context.user) : null
          );
        }
      });
    }
  });

  return new ApolloServer({
    gateway,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
    validationRules: [depthLimit(10)],
    formatError: err => {
      if (
        err.message.includes("Did you mean") &&
        process.env.NODE_ENV !== "development"
      ) {
        return new ApolloError("Internal server error");
      }

      return err;
    }
  });
}

export default initGateway;
