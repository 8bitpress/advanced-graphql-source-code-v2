import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import express from "express";
import jwt from "express-jwt";
import jwksClient from "jwks-rsa";

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: ["https://studio.apollographql.com"]
  })
);

const jwtCheck = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: false
});

app.use(jwtCheck, (err, req, res, next) => {
  if (err.code === "invalid_token") {
    return next();
  }
  return next(err);
});

app.use(
  createProxyMiddleware({
    target: process.env.ROUTER_ENDPOINT,
    changeOrigin: true,
    onProxyReq(proxyReq, req) {
      proxyReq.setHeader("user", req.user ? JSON.stringify(req.user) : null);
    }
  })
);

app.listen(port, () => {
  console.log(`Authentication proxy ready at http://localhost:${port}`);
});
