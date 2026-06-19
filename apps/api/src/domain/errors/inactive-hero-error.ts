import { AppError } from './app-error.js';

export class InactiveHeroError extends AppError {
  constructor() {
    super('Inactive heroes cannot be edited.', 409, 'INACTIVE_HERO');
  }
}
