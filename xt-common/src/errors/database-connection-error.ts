import { CustomError } from './custom-error';

/**
 * An implementation for a database connection custom error.
 * The server could not connect to the database due to system error.
 */
export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor(message?: string) {
    super(message || 'Error connecting to db');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
