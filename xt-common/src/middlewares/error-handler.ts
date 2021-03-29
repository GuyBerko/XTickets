import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';

/**
 * A middleware that catch request errors and return a constant structured error response
 * @param err - the error that was thrown
 * @param req - the express router request
 * @param res - the express router response
 * @param next - express next function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: add logger
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
