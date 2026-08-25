export class HttpError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors: any; 

    constructor(message: any, statusCode: number) {
        const msg = Array.isArray(message) ? 'Validation failed' : message;
        super(msg); 
        
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = message; 
        
        Error.captureStackTrace(this, this.constructor);
    }
}
