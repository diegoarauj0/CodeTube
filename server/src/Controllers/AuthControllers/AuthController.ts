//NodeModules
import { Request, Response } from "express"
//Controllers
import Controller from "../Controller"
//Middlewares
import { AuthenticationMiddleware } from "Middlewares"

export default class AuthController extends Controller {
  protected createRouter(): void {
    this.router.get("/session", AuthenticationMiddleware, this.session)
  }

  private session(req: Request, res: Response): void {
    res.OK({ data: { session: req.session } })
  }
}