import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gb-xtickets/common';
import { getOrderRouter } from './routes/get';
import { getAllOrdersRouter } from './routes/getAll';
import { cancelOrderRouter } from './routes/cancel';
import { createOrderRouter } from './routes/create';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

// Setup Routers
app.use([
  getOrderRouter,
  getAllOrdersRouter,
  cancelOrderRouter,
  createOrderRouter,
]);

// Setup Error middlewares
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
