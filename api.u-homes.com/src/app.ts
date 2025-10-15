import express, {Express, NextFunction, Request, Response } from 'express';
import userRouter from './routers/user.router'


const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome to U-Homes API')
})


export default app


