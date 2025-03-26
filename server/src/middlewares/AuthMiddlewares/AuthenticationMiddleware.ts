//NodeModules
import { Request, Response, NextFunction } from "express"
import { isValidObjectId } from "mongoose"
import JWT from "jsonwebtoken"
import validator from "validator"

export default function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authorization = req.headers.authorization

    if (authorization === undefined || authorization.indexOf("Bearer") === -1) { throw new Error() }

    const token = authorization.replace("Bearer", "").trim()

    if (!validator.isJWT(token)) { throw new Error() }

    const payload = JWT.verify(token, process.env.Secret_JWT || "") as { _id: string }

    if (typeof (payload) !== "object" || !isValidObjectId(payload._id)) { throw new Error() }

    req.session = { _id: payload._id }

    next()
  } catch {
    return res.Unauthorized()
  }
}