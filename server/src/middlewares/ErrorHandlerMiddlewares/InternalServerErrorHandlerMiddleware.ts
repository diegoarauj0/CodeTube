/* eslint-disable @typescript-eslint/no-unused-vars */
//NodeModules
import { Request, Response, NextFunction } from "express"

export default function InternalServerErrorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.log(error)
  res.InternalServerError()
}