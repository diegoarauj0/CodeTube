/* eslint-disable @typescript-eslint/no-unused-vars */
//NodeModules
import { Request, Response, NextFunction } from "express"

export default function NotFoundErrorHandlerMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({})
}