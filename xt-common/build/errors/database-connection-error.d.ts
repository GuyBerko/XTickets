import { CustomError } from './custom-error';
export declare class DatabaseConnectionError extends CustomError {
    reason: string;
    statusCode: number;
    constructor(message?: string);
    serializeErrors(): {
        message: string;
    }[];
}
