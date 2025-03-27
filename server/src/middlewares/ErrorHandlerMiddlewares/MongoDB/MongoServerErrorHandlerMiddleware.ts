//NodeModules
import { Request, Response, NextFunction } from "express"

//Config
import mongoServerErrorMessageConfig from "config/mongoServerErrorMessageConfig"

export default function MongoServerErrorHandlerMiddleware(mongoServerError: any, req: Request, res: Response, next: NextFunction): void {
  if (mongoServerError.name === "MongoServerError") {
    const mongoServerErrorType = ((mongoServerErrorMessageConfig as any)[mongoServerError.code]?.type || mongoServerErrorMessageConfig.unknown.type) as string
    let mongoServerErrorMessage = ((mongoServerErrorMessageConfig as any)[mongoServerError.code]?.message || mongoServerErrorMessageConfig.unknown.message) as string

    mongoServerErrorMessage = mongoServerErrorMessage.replace(/{{field}}/gi, Object.keys(mongoServerError.keyValue)[0] as string)
    mongoServerErrorMessage = mongoServerErrorMessage.replace(/{{value}}/gi, mongoServerError.keyValue[Object.keys(mongoServerError.keyValue)[0]] as string)

    return res.BadRequestError([{
      field: Object.keys(mongoServerError.keyValue)[0] as string,
      value: mongoServerError.keyValue[Object.keys(mongoServerError.keyValue)[0]] as string,
      message: mongoServerErrorMessage,
      type: mongoServerErrorType as any,
      path: "body",
      properties: {}
    }])
  }

  next(mongoServerError)
}