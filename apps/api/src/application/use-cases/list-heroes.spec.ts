import { describe, expect, it } from 'vitest';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { CreateHeroUseCase } from './create-hero.js';
import { ListHeroesUseCase } from './list-heroes.js';

describe('ListHeroesUseCase', () => {
  it('lists heroes ordered by most recent first and supports search', async () => {
    const repository = new InMemoryHeroesRepository();
    const createHero = new CreateHeroUseCase(repository);
    const listHeroes = new ListHeroesUseCase(repository);

    await createHero.execute({
      name: 'Clark Kent',
      nickname: 'Superman',
      date_of_birth: new Date('1938-06-01T00:00:00.000Z'),
      universe: 'DC',
      main_power: 'Flight',
      avatar_url: 'https://example.com/superman.png'
    });

    await new Promise((resolve) => setTimeout(resolve, 2));

    await createHero.execute({
      name: 'Peter Parker',
      nickname: 'Spider-Man',
      date_of_birth: new Date('1962-08-10T00:00:00.000Z'),
      universe: 'Marvel',
      main_power: 'Spider sense',
      avatar_url: 'https://example.com/spider.png'
    });

    const result = await listHeroes.execute({ search: 'spider', page: 1, perPage: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.nickname).toBe('Spider-Man');
    expect(result.meta.total).toBe(1);
  });
});
