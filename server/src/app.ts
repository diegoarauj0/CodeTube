//NodeModules
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

//Middlewares
import {
  InternalServerErrorHandlerMiddleware,
  NotFoundErrorHandlerMiddleware,
  ValidationErrorHandlerMiddleware,
  APIResponseMiddleware,
  MongoServerErrorHandlerMiddleware
} from "Middlewares"

//Router
import router from "./router"

//Config
import connectMongoDB from "./config/connectMongoDB"

dotenv.config()

export default class App {
  private readonly express: express.Application

  constructor() {
    this.express = express()
    this.main()
  }

  private async main(): Promise<void> {
    await this.setupMongoDB()
    this.setupMiddleware()
    this.setupRouter()
    this.setupErrorHandler()
    this.listen()
  }

  private setupErrorHandler(): void {
    this.express.use(NotFoundErrorHandlerMiddleware)
    this.express.use(MongoServerErrorHandlerMiddleware)
    this.express.use(ValidationErrorHandlerMiddleware)
    this.express.use(InternalServerErrorHandlerMiddleware)
  }

  private async setupMongoDB(): Promise<void> {
    await connectMongoDB()
  }

  private listen(): void {
    this.express.listen(process.env.Port_Express || 80, (error) => {
      if (error) { console.error(error); return }
      console.log(`http server online on port ${process.env.Port_Express || 80}`)
    })
  }

  private setupMiddleware(): void {
    this.express.use(cors())
    this.express.use(APIResponseMiddleware)
    this.express.use(express.json({ strict: true }))
  }

  private setupRouter(): void {
    this.express.use(router)
  }
}