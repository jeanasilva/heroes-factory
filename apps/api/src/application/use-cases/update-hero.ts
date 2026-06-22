import type { Hero, UpdateHeroInput } from '../../domain/entities/hero.js';
import { InactiveHeroError } from '../../domain/errors/inactive-hero-error.js';
import { NotFoundError } from '../../domain/errors/not-found-error.js';
import type { HeroesRepository } from '../repositories/heroes-repository.js';

export class UpdateHeroUseCase {
  constructor(private readonly heroesRepository: HeroesRepository) {}

  async execute(id: string, data: UpdateHeroInput): Promise<Hero> {
    const hero = await this.heroesRepository.findById(id);

    if (!hero) {
      throw new NotFoundError('Herói');
    }

    if (!hero.is_active) {
      throw new InactiveHeroError();
    }

    return this.heroesRepository.update(id, data);
  }
}
