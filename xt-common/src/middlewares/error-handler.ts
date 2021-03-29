import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';

/**
 *
 * @param err - the error that was thrown
 * @param req - the express router request
 * @param res - the express router response
 * @param next - express next function
 * @returns
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
