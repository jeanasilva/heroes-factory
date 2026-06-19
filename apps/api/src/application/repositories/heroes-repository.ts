import type { CreateHeroInput, Hero, UpdateHeroInput } from '../../domain/entities/hero.js';

export interface ListHeroesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface ListHeroesResult {
  heroes: Hero[];
  total: number;
}

export interface HeroesRepository {
  create(data: CreateHeroInput): Promise<Hero>;
  findById(id: string): Promise<Hero | null>;
  list(params: ListHeroesParams): Promise<ListHeroesResult>;
  update(id: string, data: UpdateHeroInput): Promise<Hero>;
  deactivate(id: string): Promise<Hero>;
  activate(id: string): Promise<Hero>;
}
