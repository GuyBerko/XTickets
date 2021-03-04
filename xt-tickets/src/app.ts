import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@gb-xtickets/common';
import { createTicketRouter } from './routes/create';
import { getTicketRouter } from './routes/get';
import { getAllTicketsRouter } from './routes/getAll';
import { updateTicketRouter } from './routes/update';
import { getTicketCategoriesRouter } from './routes/getCategories';

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

// Setup Routers
app.use([
  createTicketRouter,
  getTicketRouter,
  getAllTicketsRouter,
  updateTicketRouter,
  getTicketCategoriesRouter,
]);

// Setup Error middlewares
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
