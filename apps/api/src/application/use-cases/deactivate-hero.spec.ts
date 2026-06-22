import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors/not-found-error.js';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { CreateHeroUseCase } from './create-hero.js';
import { DeactivateHeroUseCase } from './deactivate-hero.js';

describe('DeactivateHeroUseCase', () => {
  it('marks an active hero as inactive', async () => {
    const repository = new InMemoryHeroesRepository();
    const createHero = new CreateHeroUseCase(repository);
    const deactivateHero = new DeactivateHeroUseCase(repository);

    const hero = await createHero.execute({
      name: 'Natasha Romanoff',
      nickname: 'Viúva Negra',
      date_of_birth: new Date('1984-11-22T00:00:00.000Z'),
      universe: 'Marvel',
      main_power: 'Espionagem e combate',
      avatar_url: 'https://example.com/black-widow.png'
    });

    const deactivated = await deactivateHero.execute(hero.id);

    expect(deactivated.is_active).toBe(false);
    expect(deactivated.id).toBe(hero.id);
  });

  it('throws when hero does not exist', async () => {
    const repository = new InMemoryHeroesRepository();
    const deactivateHero = new DeactivateHeroUseCase(repository);

    await expect(deactivateHero.execute('00000000-0000-4000-8000-000000000000')).rejects.toBeInstanceOf(NotFoundError);
  });
});
