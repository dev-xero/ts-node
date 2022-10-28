import express, { Application } from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import Controller from '@/utils/interfaces/controller.interface'
import ErrorMiddleWare from '@/middleware/error.middleware'

class App {
  public express: Application
  public port: number
  constructor(controllers: Controller[], port: number) {
    this.express = express()
    this.port = port
    this.initializeDBConnection()
    this.initializeMiddleWare()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeMiddleWare(): void {
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(morgan('dev'))
    this.express.use(express.json())
    this.express.use(
      express.urlencoded({
        extended: false,
      })
    )
    this.express.use(compression())
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router)
    })
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleWare)
  }

  private initializeDBConnection(): void {
    const { MONGO_URI } = process.env
    mongoose
      .connect(MONGO_URI as string)
      .then((conn) =>
        console.log(
          `Successfully connected to the database at: ${conn.connection.host}`
        )
      )
      .catch((err) => console.log(err))
  }

  public listen(): void {
    this.express.listen(this.port, () =>
      console.log(`App listening on port ${this.port}`)
    )
  }
}

export default App