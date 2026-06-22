import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors/not-found-error.js';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { CreateHeroUseCase } from './create-hero.js';
import { GetHeroByIdUseCase } from './get-hero-by-id.js';

describe('GetHeroByIdUseCase', () => {
  it('returns the hero when it exists', async () => {
    const repository = new InMemoryHeroesRepository();
    const createHero = new CreateHeroUseCase(repository);
    const getHeroById = new GetHeroByIdUseCase(repository);

    const created = await createHero.execute({
      name: 'Arthur Curry',
      nickname: 'Aquaman',
      date_of_birth: new Date('1985-01-29T00:00:00.000Z'),
      universe: 'DC',
      main_power: 'Comunicação com a vida marinha',
      avatar_url: 'https://example.com/aquaman.png'
    });

    const hero = await getHeroById.execute(created.id);

    expect(hero.nickname).toBe('Aquaman');
    expect(hero.universe).toBe('DC');
  });

  it('throws when hero does not exist', async () => {
    const repository = new InMemoryHeroesRepository();
    const getHeroById = new GetHeroByIdUseCase(repository);

    await expect(getHeroById.execute('00000000-0000-4000-8000-000000000000')).rejects.toBeInstanceOf(NotFoundError);
  });
});
