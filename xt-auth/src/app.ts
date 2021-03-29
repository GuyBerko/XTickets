import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@gb-xtickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

const app = express();

// Setup trust proxy to allow non https requests
app.set('trust proxy', true);

// Add json parsing and session cookies
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// Setup Routers
app.use([currentUserRouter, signinRouter, signupRouter, signoutRouter]);

// Setup Error middlewares
app.all('*', () => {
  throw new NotFoundError('Error Not Found');
});
app.use(errorHandler);

export { app };
