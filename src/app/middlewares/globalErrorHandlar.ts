/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import handleZodError from './handleZodError';
import { TErrorSources } from '../types/errors';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next): void => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: TErrorSources | undefined;

  // Ensure err is an object before checking properties
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorDetails = simplifiedError.errorDetails

  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetails && { errorDetails }),
    stack: config.NODE_ENV === 'development' ? err instanceof Error ? err.stack : null : null,
  });
};

export default globalErrorHandler;
