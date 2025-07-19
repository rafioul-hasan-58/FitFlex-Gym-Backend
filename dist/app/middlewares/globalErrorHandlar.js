"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("./handleZodError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorDetails;
    // Ensure err is an object before checking properties
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorDetails = simplifiedError.errorDetails.map((detail) => ({
            path: detail.field,
            message: detail.message,
        }));
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorDetails = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    res.status(statusCode).json(Object.assign({ success: false, message }, (errorDetails && { errorDetails })));
};
exports.default = globalErrorHandler;
