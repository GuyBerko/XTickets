import { CustomError } from './custom-error';

/**
 * An implementation for a not authorized request custom error.
 * The client must authenticate itself to get the requested response.
 */
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message?: string) {
    super(message || 'Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message || 'Not authorized' }];
  }
}
