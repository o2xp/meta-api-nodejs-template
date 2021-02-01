import { Request, Response } from "express";
import ExampleService from "../services/gateway/example.service";

class ExampleController {
  private exampleSrvc: ExampleService;
  public constructor() {
    this.exampleSrvc = new ExampleService();
  }

  public getUserDetails = (req: Request, res: Response): void => {
    const result = this.exampleSrvc.getUserDetails(
      req.headers["userId"].toString()
    );

    res.send(result);
  };
}

export default ExampleController;
