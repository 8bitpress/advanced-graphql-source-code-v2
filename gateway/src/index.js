import http from "http";

import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";

const port = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "world";
    }
  }
};

const gateway = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await gateway.start();
gateway.applyMiddleware({ app, path: "/" });

await new Promise(resolve => httpServer.listen({ port }, resolve));
console.log(`Gateway ready at http://localhost:${port}${gateway.graphqlPath}`);
