import { describe, expect, it } from 'vitest';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { CreateHeroUseCase } from './create-hero.js';

describe('CreateHeroUseCase', () => {
  it('creates an active hero', async () => {
    const repository = new InMemoryHeroesRepository();
    const useCase = new CreateHeroUseCase(repository);

    const hero = await useCase.execute({
      name: 'Robert Bruce Banner',
      nickname: 'Hulk',
      date_of_birth: new Date('1962-04-10T00:00:00.000Z'),
      universe: 'Marvel',
      main_power: 'Super strength',
      avatar_url: 'https://example.com/hulk.png'
    });

    expect(hero.id).toEqual(expect.any(String));
    expect(hero.is_active).toBe(true);
    expect(repository.heroes).toHaveLength(1);
  });
});
