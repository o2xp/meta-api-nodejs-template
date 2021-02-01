import dotenv from "dotenv";
import compression from "compression";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import { Request, Response, Application } from "express";
import pjson from "../package.json";
import logger, { errorLogger, requestLogger } from "./utils/winston.logger";
import initExampleRoutes from "./routes/example.route";

class App {
  public app: express.Application;

  constructor() {
    logger.debug(`META VERSION: ${pjson.version}`);
    logger.debug(`Time: ${new Date()}`);
    dotenv.config();
    this.app = express();

    this.config();
    initExampleRoutes(this.app);

    // ErrorLogger makes sense AFTER the router.
    this.app.use(errorLogger);
  }

  private config(): void {
    // Helmet is helps to set some HTTP response headers,
    // to protect against well known vulnerabilities.
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      compression({
        // filter: Decide if the answer should be compressed or not.
        filter: this.shouldExpressCompress,
        // threshold: It is the byte threshold for the response
        // body size before considering compression, the default is 1 kB.
        threshold: 10,
        // Fastest compression.
        level: 1,
      })
    );
    // Support application/json type post data.
    this.app.use(bodyParser.json({ limit: 50000000 }));
    // Support application/x-www-form-urlencoded post data.
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // Logger makes sense BEFORE the router.
    // It will log all the express requests.
    this.app.use(requestLogger);
  }

  private shouldExpressCompress(req, res) {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  }
}

export default new App().app;
