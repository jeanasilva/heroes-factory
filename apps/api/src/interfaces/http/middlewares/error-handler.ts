import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../domain/errors/app-error.js';

export function errorHandler(error: Error, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation failed.',
      code: 'VALIDATION_ERROR',
      issues: error.flatten().fieldErrors
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error.',
    code: 'INTERNAL_SERVER_ERROR'
  });
}
