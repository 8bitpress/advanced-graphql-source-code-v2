import {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource
} from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

function initGateway(httpServer) {
  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: "accounts", url: "http://localhost:4001" },
        { name: "profiles", url: "http://localhost:4002" },
        { name: "bookmarks", url: "http://localhost:4003" }
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
    }
  });
}

export default initGateway;
