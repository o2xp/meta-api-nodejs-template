import dotenv from "dotenv";
import https from "https";
import http from "http";
import { Application } from "express";
import app from "./App";
import logger from "./utils/winston.logger";
import {
  CERTIFICATE_SRV,
  CRT_PRIVATE_SRV_KEY,
  ENVIRONMENT,
  isPRODEnv,
  META_PORT,
} from "./utils/secrets.helper";

dotenv.config();

logger.info("NODE_ENV is " + ENVIRONMENT);

let server: https.Server | http.Server | Application;

if (isPRODEnv) {
  const credentials = { key: CRT_PRIVATE_SRV_KEY, cert: CERTIFICATE_SRV };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

server.listen(META_PORT, () => {
  console.debug("Express server listening on port " + META_PORT);
  console.info("META is UP");
  if (isPRODEnv) {
    console.info("SSL is active");
  } else {
    console.info("SSL not active");
  }
});
