//NodeModules
import { Request, Response } from "express"

//Controllers
import Controller from "./controller"

//Models
import { UserModel } from "models"

//Middlewares
import { AsyncHandlerMiddleware } from "middlewares/index"

export default class LocalAuthController extends Controller {
  protected createRouter(): void {
    this.router.post("/Login", AsyncHandlerMiddleware(this.login))
    this.router.post("/Register", AsyncHandlerMiddleware(this.register))
  }

  private async register(req: Request, res: Response): Promise<void> {
    const username = typeof (req.body.username) === "string" ? req.body.username : ""
    const password = typeof (req.body.password) === "string" ? req.body.password : ""
    const email = typeof (req.body.email) === "string" ? req.body.email : ""

    const user = new UserModel({ password: password, email: email, username: username })

    await user.save()

    res.Created({ user: user.publicJSON(), token: user.createJWT() })
  }

  private async login(req: Request, res: Response): Promise<void> {
    const password = typeof (req.body.password) === "string" ? req.body.password : ""
    const email = typeof (req.body.email) === "string" ? req.body.email : ""

    const user = await UserModel.findOne({ email: email })

    if (!user) {
      return res.BadRequestError([{
        field: "email",
        value: email,
        path: "body",
        type: "notFound",
        message: "No user registered with that email",
        properties: {},
      }])
    }

    if (!await user.comparePassword(password)) {
      return res.BadRequestError([{
        field: "password",
        value: password,
        path: "body",
        type: "incorrect",
        message: "Incorrect password",
        properties: {},
      }])
    }

    res.OK({ user: user.publicJSON(), token: user.createJWT() })
  }
}