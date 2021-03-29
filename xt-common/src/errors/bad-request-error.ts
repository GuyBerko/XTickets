import { CustomError } from './custom-error';

/**
 * An implementation for a bad request custom error.
 * The server could not understand the request due to invalid syntax.
 */
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message?: string) {
    super(message || 'Bad Request');

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message || 'Bad Request' }];
  }
}
