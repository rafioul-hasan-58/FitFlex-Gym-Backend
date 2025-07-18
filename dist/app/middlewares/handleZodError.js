"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorDetails = err.issues.map((issue) => {
        const rawPath = issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1];
        const path = typeof rawPath === 'string' || typeof rawPath === 'number' ? rawPath : String(rawPath);
        return {
            path,
            message: issue.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation error occurred',
        errorDetails,
    };
};
exports.default = handleZodError;
