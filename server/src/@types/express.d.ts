declare namespace Express {
  export interface Response {
    OK: (data: any) => void // 200
    Created: (data: any) => void // 201
    BadRequestError: (errors: import("../Middlewares/APIMiddlewares/APIResponseMiddleware").IBadRequestError[]) => void // 400
    Unauthorized: () => void // 403
    NotFoundError: () => void // 404
    InternalServerError: () => void // 500
  }

  export interface Request {
    session?: {
      _id?: string;
    }
  }
}