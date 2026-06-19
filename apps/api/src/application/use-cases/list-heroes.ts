import type { Hero } from '../../domain/entities/hero.js';
import type { HeroesRepository } from '../repositories/heroes-repository.js';

export interface ListHeroesRequest {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface ListHeroesResponse {
  data: Hero[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export class ListHeroesUseCase {
  constructor(private readonly heroesRepository: HeroesRepository) {}

  async execute({ page = 1, perPage = 10, search }: ListHeroesRequest): Promise<ListHeroesResponse> {
    const safePage = Math.max(1, page);
    const safePerPage = Math.min(Math.max(1, perPage), 50);
    const { heroes, total } = await this.heroesRepository.list({
      page: safePage,
      perPage: safePerPage,
      search
    });

    return {
      data: heroes,
      meta: {
        page: safePage,
        perPage: safePerPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / safePerPage))
      }
    };
  }
}
