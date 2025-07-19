import { ZodError, ZodIssue } from 'zod';
import { TZodErrorSources, TZodGenericErrorResponse } from '../types/errors';

const handleZodError = (err: ZodError): TZodGenericErrorResponse => {
  const errorDetails: TZodErrorSources = err.issues.map((issue: ZodIssue) => {
    const rawPath = issue?.path[issue.path.length - 1];
    const field = typeof rawPath === 'string' || typeof rawPath === 'number' ? rawPath : String(rawPath);
    return {
      field,
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

export default handleZodError;

