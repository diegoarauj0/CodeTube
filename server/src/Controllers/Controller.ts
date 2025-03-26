//NodeModules
import { Router } from "express"

export default class Controller {
  protected router:Router = Router()

  constructor() {
    this.createRouter()
  }

  public get getRouter(): Router { return this.router }

  protected createRouter(): void {}
}