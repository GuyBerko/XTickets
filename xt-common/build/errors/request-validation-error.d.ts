import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
export declare class RequestValidationError extends CustomError {
    private errors;
    statusCode: number;
    constructor(errors: ValidationError[], message?: string);
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
