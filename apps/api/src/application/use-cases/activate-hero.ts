import type { Hero } from '../../domain/entities/hero.js';
import { NotFoundError } from '../../domain/errors/not-found-error.js';
import type { HeroesRepository } from '../repositories/heroes-repository.js';

export class ActivateHeroUseCase {
  constructor(private readonly heroesRepository: HeroesRepository) {}

  async execute(id: string): Promise<Hero> {
    const hero = await this.heroesRepository.findById(id);

    if (!hero) {
      throw new NotFoundError('Herói');
    }

    return this.heroesRepository.activate(id);
  }
}
