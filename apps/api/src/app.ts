import express, {Express, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { swaggerDocs } from "./config/swagger";
import errorMiddleware from './middlewares/error.middlewere'
import morgan from 'morgan'
import { stream } from "./utils/logger"
import agentRouter from './routers/agent.router'
import studentRouter from './routers/student.router'
import propertyRouter from './routers/property.route'
import bookingRouter from './routers/booking.router'



declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
const app = express()


const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

// Skip Swagger & favicon routes to avoid clutter
  const skip = (req: express.Request, res: express.Response) => {
  return req.originalUrl.startsWith("/api-docs") || req.originalUrl === "/favicon.ico";
}

app.use(cors({
  origin: '*', // Allow all origins (you can restrict this later)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(morganFormat, { stream, skip }))


app.get('/', (req:Request, res:Response) => {
    res.send('welcome to U-Homes API')
})

app.use('/api/agent', agentRouter)
app.use('/api/student', studentRouter)
app.use('/api/property', propertyRouter)
app.use('/api/booking', bookingRouter)

swaggerDocs(app, Number(process.env.PORT) || 7000);

app.use(errorMiddleware)

export default app


