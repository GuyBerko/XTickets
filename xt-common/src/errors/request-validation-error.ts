import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

/**
 * An implementation for a request validation custom error.
 * The request was not including the require parameters or the parameters was not valid.
 */
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[], message?: string) {
    super(message || 'Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
