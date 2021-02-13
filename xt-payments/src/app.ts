import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gb-xtickets/common';
import { createChargeRouter } from './routes/create';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

// Setup routes
app.use([createChargeRouter]);

// Setup Error middlewares
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
