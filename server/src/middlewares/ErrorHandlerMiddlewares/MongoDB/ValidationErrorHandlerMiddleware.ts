//NodeModules
import { Request, Response, NextFunction } from "express"
//Middlewares
import { BadRequestErrorType, IBadRequestError } from "Middlewares/APIMiddlewares/APIResponseMiddleware" 

interface ValidatorProperties {
  message: string;
  type: string;
  path: string;
  value: any;
}

interface ValidatorError {
  properties: ValidatorProperties;
  kind: string;
  path: string;
  value: string;
}

function filterProperties(properties: { [key: string]: any }) {
  const filteredProperties: {[key: string]: any} = {}
  const filter = ["minlength", "maxlength", "alphanumeric", "ignore", "minUppercase", "minLowercase", "minSymbols", "minNumbers"]

  Object.keys(properties).forEach((name) => {
    if (filter.indexOf(name) !== -1) { filteredProperties[name] = properties[name] } 
  })

  return filteredProperties
}

export default function ValidationErrorHandlerMiddleware(validationError: any, req: Request, res: Response, next: NextFunction): void {
  if (validationError.name === "ValidationError") {
    const errors = validationError.errors
    const errorResponse:IBadRequestError[] = []

    Object.keys(errors).forEach((name) => {
      const validatorError = errors[name] as ValidatorError
      if (validatorError.properties.type === "errorInJSON") {
        const errorJSON = JSON.parse(validatorError.properties.message)

        errorResponse.push({
          properties:filterProperties(errorJSON),
          message:errorJSON.message,
          field:validatorError.properties.path,
          path:"body",
          type:errorJSON.type,
          value:validatorError.value,
        })

        return
      } 

      errorResponse.push({
        properties:filterProperties(validatorError.properties),
        message:validatorError.properties.message,
        field:validatorError.properties.path,
        path:"body",
        type:validatorError.properties.type as BadRequestErrorType,
        value:validatorError.value,
      })
    })

    return res.BadRequestError(errorResponse)
  }

  next(validationError)
}