import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../domain/errors/app-error.js';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Dados inválidos. Revise os campos enviados.',
      code: 'VALIDATION_ERROR',
      issues: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      code: error.code
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: 'Erro interno no servidor. Tente novamente em instantes.',
    code: 'INTERNAL_SERVER_ERROR'
  });
};
