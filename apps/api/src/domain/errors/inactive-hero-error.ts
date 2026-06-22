import { AppError } from './app-error.js';

export class InactiveHeroError extends AppError {
  constructor() {
    super('Heróis inativos não podem ser editados.', 409, 'INACTIVE_HERO');
  }
}
