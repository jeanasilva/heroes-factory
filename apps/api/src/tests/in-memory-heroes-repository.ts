import { randomUUID } from 'node:crypto';
import type { CreateHeroInput, Hero, UpdateHeroInput } from '../domain/entities/hero.js';
import type {
  HeroesRepository,
  ListHeroesParams,
  ListHeroesResult
} from '../application/repositories/heroes-repository.js';

export class InMemoryHeroesRepository implements HeroesRepository {
  public heroes: Hero[] = [];

  async create(data: CreateHeroInput): Promise<Hero> {
    const now = new Date();
    const hero: Hero = {
      id: randomUUID(),
      ...data,
      is_active: true,
      created_at: now,
      updated_at: now
    };

    this.heroes.push(hero);
    return hero;
  }

  async findById(id: string): Promise<Hero | null> {
    return this.heroes.find((hero) => hero.id === id) ?? null;
  }

  async list({ page, perPage, search }: ListHeroesParams): Promise<ListHeroesResult> {
    const normalizedSearch = search?.toLowerCase();
    const filtered = normalizedSearch
      ? this.heroes.filter(
          (hero) =>
            hero.name.toLowerCase().includes(normalizedSearch) ||
            hero.nickname.toLowerCase().includes(normalizedSearch)
        )
      : this.heroes;

    const sorted = [...filtered].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    return {
      heroes: sorted.slice((page - 1) * perPage, page * perPage),
      total: filtered.length
    };
  }

  async update(id: string, data: UpdateHeroInput): Promise<Hero> {
    const index = this.heroes.findIndex((hero) => hero.id === id);
    const currentHero = this.heroes[index];

    if (!currentHero) {
      throw new Error('Hero not found');
    }

    const hero: Hero = {
      ...currentHero,
      ...data,
      updated_at: new Date()
    };

    this.heroes[index] = hero;
    return hero;
  }

  async deactivate(id: string): Promise<Hero> {
    return this.setActiveStatus(id, false);
  }

  async activate(id: string): Promise<Hero> {
    return this.setActiveStatus(id, true);
  }

  private async setActiveStatus(id: string, isActive: boolean): Promise<Hero> {
    const index = this.heroes.findIndex((hero) => hero.id === id);
    const currentHero = this.heroes[index];

    if (!currentHero) {
      throw new Error('Hero not found');
    }

    const hero: Hero = {
      ...currentHero,
      is_active: isActive,
      updated_at: new Date()
    };

    this.heroes[index] = hero;
    return hero;
  }
}
