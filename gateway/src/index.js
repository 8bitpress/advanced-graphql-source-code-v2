import http from "http";

import app from "./config/app.js";
import initGateway from "./config/apollo.js";

const port = process.env.PORT;
const httpServer = http.createServer(app);
const gateway = initGateway(httpServer);

await gateway.start();
gateway.applyMiddleware({ app, path: "/" });

await new Promise(resolve => httpServer.listen({ port }, resolve));
console.log(`Gateway ready at http://localhost:${port}${gateway.graphqlPath}`);
