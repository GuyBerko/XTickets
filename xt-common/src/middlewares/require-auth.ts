import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/**
 * A middleware for private routes that require an authenticated users.
 * If ther is no currentUser object in the request throw an NotAuthorizedError.
 * Should only be used after the current-user middleware.
 * @param req - the express router request
 * @param res - the express router response
 * @param next - express next function
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: replace this with jwt check so this middleware can be used without the current-user middleware.
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
