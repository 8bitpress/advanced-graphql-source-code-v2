import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

import {
  authDirectives,
  restoreReferenceResolvers
} from "../../shared/src/index.js";
import initTemporalWorker from "./temporal/worker.js";
import resolvers from "./graphql/resolvers.js";
import WorkflowsDataSource from "./graphql/dataSources/WorkflowsDataSource.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT;

const { authDirectivesTypeDefs, authDirectivesTransformer } = authDirectives();
const subgraphTypeDefs = readFileSync(
  resolve(__dirname, "./graphql/schema.graphql"),
  "utf-8"
);
const typeDefs = gql(`${subgraphTypeDefs}\n${authDirectivesTypeDefs}`);
let subgraphSchema = buildSubgraphSchema({ typeDefs, resolvers });
subgraphSchema = authDirectivesTransformer(subgraphSchema);
restoreReferenceResolvers(subgraphSchema, resolvers);

const server = new ApolloServer({
  schema: subgraphSchema,
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user };
  },
  dataSources: () => {
    return {
      workflowsAPI: new WorkflowsDataSource()
    };
  }
});

initTemporalWorker().catch(error => {
  console.error(error);
  process.exit(1);
});

server.listen({ port }).then(({ url }) => {
  console.log(`Workflows service ready at ${url}`);
});
