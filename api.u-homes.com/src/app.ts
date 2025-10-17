import express, {Express, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import userRouter from './routers/user.router'
import { swaggerDocs } from "./config/swagger";


declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}
const app = express()

app.use(cors({
  origin: "*", // Allow all origins (you can restrict this later)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())


app.get('/', (req:Request, res:Response) => {
    res.send('welcome to U-Homes API')
})

app.use('/api/users', userRouter)

swaggerDocs(app, Number(process.env.PORT) || 7000);

export default app


