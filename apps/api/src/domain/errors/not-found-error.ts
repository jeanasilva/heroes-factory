import { AppError } from './app-error.js';

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado.`, 404, 'NOT_FOUND');
  }
}
