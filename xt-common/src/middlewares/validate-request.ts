import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

/**
 * Check that the request params is valid.
 * Using the express-validator for the validation.
 * If the request params are not valid throw RequestValidationError with the express-validator errors array
 * @param req - the express router request
 * @param res - the express router response
 * @param next - express next function
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
