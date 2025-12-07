import express, { Request, Response } from 'express';
import cors from 'cors';
import { swaggerDocs } from './config/swagger';
import errorMiddleware from './middlewares/error.middlewere';
import morgan from 'morgan';
import { stream } from './utils/logger';
import authRouter from './routers/auth.router';
import userRouter from './routers/user.router';
import propertyRouter from './routers/property.route';
import bookingRouter from './routers/booking.router';
import paymentRouter from './routers/payment.router';
import transactionRouter from './routers/transaction.router';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      type?: string;
      role?: string; // Keep for backward compatibility
    };
  }
}
const app = express();

const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

// Skip Swagger & favicon routes to avoid clutter
const skip = (req: express.Request) => {
  return req.originalUrl.startsWith('/api-docs') || req.originalUrl === '/favicon.ico';
};

app.use(
  cors({
    origin: '*', // Allow all origins (you can restrict this later)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(morganFormat, { stream, skip }));

app.get('/', (req: Request, res: Response) => {
  res.send('welcome to U-Homes API');
});

// New unified auth routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use('/api/property', propertyRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/transaction', transactionRouter);
// Review routes are nested under property routes, so they're handled by propertyRouter

swaggerDocs(app);

app.use(errorMiddleware);

export default app;
