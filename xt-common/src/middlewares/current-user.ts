import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Define the user payload structure
 */
interface UserPayload {
  id: string;
  email: string;
}

// Add the currentUser variable to the global express request interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * A middleware that add the cuurent user data to the request.
 * it's look for jwt in the request session if exist verify and decrypt it.
 * @param req - the express router request
 * @param res - the express router response
 * @param next - express next function
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) {}

  next();
};
