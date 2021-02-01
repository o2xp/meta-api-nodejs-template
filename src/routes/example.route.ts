import { Request, Response, Application } from "express";
import { META_BASE_ROUTE } from "../utils/secrets.helper";
import pjson from "../../package.json";
import ExampleController from "../controllers/example.controller";

const exampleController = new ExampleController();

const initExampleRoutes = (app: Application): void => {
  app.get(META_BASE_ROUTE, (req: Request, res: Response) => {
    res.json({ message: `Welcome to META v${pjson.version}` });
  });

  app.get(META_BASE_ROUTE + "version", (req: Request, res: Response): void => {
    res.json(pjson.version);
  });

  app.get(META_BASE_ROUTE + "user", (req: Request, res: Response): void => {
    exampleController.getUserDetails(req, res);
  });

  app.use((req: Request, res: Response): void => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
  });
};

export default initExampleRoutes;
