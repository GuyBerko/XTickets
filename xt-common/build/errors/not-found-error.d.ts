import { CustomError } from './custom-error';
export declare class NotFoundError extends CustomError {
    statusCode: number;
    constructor(message?: string);
    serializeErrors(): {
        message: string;
    }[];
}
