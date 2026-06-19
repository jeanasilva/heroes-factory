import type { Hero } from '../../domain/entities/hero.js';
import type { HeroesRepository } from '../repositories/heroes-repository.js';

interface CreateHeroRequest {
  name: string;
  nickname: string;
  date_of_birth: Date;
  universe: string;
  main_power: string;
  avatar_url: string;
}

export class CreateHeroUseCase {
  constructor(private readonly heroesRepository: HeroesRepository) {}

  async execute(data: CreateHeroRequest): Promise<Hero> {
    return this.heroesRepository.create(data);
  }
}
