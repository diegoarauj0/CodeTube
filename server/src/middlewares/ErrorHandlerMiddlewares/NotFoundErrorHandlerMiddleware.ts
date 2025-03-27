//NodeModules
import { Request, Response } from "express"

export default function NotFoundErrorHandlerMiddleware(req: Request, res: Response): void {
  res.NotFoundError()
}