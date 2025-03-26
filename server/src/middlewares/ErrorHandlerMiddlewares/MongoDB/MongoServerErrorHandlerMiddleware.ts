//NodeModules
import { Request, Response, NextFunction } from "express"
//Config
import listMongoServerError from "config/listMongoServerError"

export default function MongoServerErrorHandlerMiddleware(mongoServerError: any, req: Request, res: Response, next: NextFunction): void {
  if (mongoServerError.name === "MongoServerError") {
    const mongoServerErrorType = ((listMongoServerError as any)[mongoServerError.code]?.type || listMongoServerError.unknown.type) as string
    let mongoServerErrorMessage = ((listMongoServerError as any)[mongoServerError.code]?.message || listMongoServerError.unknown.message) as string

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