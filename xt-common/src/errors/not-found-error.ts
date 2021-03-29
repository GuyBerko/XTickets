import { CustomError } from './custom-error';

/**
 * An implementation for a not found custom error.
 * The server can not find the requested resource.
 * this means the URL is not recognized or that the endpoint is valid but the resource itself does not exist.
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message?: string) {
    super(message || 'Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message || 'Not Found' }];
  }
}
