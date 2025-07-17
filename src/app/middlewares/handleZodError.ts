import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../types/errors';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorDetails: TErrorSources = err.issues.map((issue: ZodIssue) => {
    const rawPath = issue?.path[issue.path.length - 1];
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

export default handleZodError;

