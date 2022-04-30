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
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "accounts", url: "http://localhost:4001" },
        { name: "profiles", url: "http://localhost:4002" },
        { name: "bookmarks", url: "http://localhost:4003" },
        { name: "workflows", url: "http://localhost:4004" }
      ],
      pollIntervalInMs: 1000
    }),
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
