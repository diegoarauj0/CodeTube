//NodeModules
import { Request, Response, NextFunction } from "express"

export type BadRequestErrorType = "notFound" | "incorrect" | "unknown" | "duplicate"

export interface IBadRequestErrorProperties {
  minlength?: number;
  maxlength?: number;
  alphanumeric?: boolean;
  ignore?: string[];
  minUppercase?: number;
  minLowercase?: number;
  minSymbols?: number;
  minNumbers?: number;
}

export interface IBadRequestError {
  field: string;
  path: string;
  value: any;
  message: string;
  type: BadRequestErrorType;
  properties: IBadRequestErrorProperties;
}

function APIResponse(req: Request, res: Response, statusCode: number, status: string, message: string, success:boolean, json: any): void {
  res.status(statusCode).json({
    status: status,
    statusCode: statusCode,
    message: message,
    success: success,
    ...json,
    URL: req.originalUrl,
    timestamp: new Date(),
  })
}

export function APIResponseMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.OK = (data: any) => { APIResponse(req, res, 200, "OK", "Request processed successfully.", true, { data:data }) }
  res.Created = (data: any) => { APIResponse(req, res, 201, "Created", "Resource created successfully.", true, { data:data }) }
  res.BadRequestError = (errors: IBadRequestError[]) => { APIResponse(req, res, 400, "BadRequestError", "Something went wrong with your request.", false, { details:errors } ) }
  res.Unauthorized = () => { APIResponse(req, res, 401, "Unauthorized", "The authentication token is missing or invalid.", false, { details:{ type:"Bearer" } }) }
  res.NotFoundError = () => { APIResponse(req, res, 404, "NotFoundError", "This URL method or parameter was not found.", false, { method:req.method }) }
  res.InternalServerError = () => { APIResponse(req, res, 500, "InternalServerError", "An unknown error occurred on the server.", false, {}) }
  next()
}