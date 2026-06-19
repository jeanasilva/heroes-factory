import { describe, expect, it } from 'vitest';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { InactiveHeroError } from '../../domain/errors/inactive-hero-error.js';
import { CreateHeroUseCase } from './create-hero.js';
import { DeactivateHeroUseCase } from './deactivate-hero.js';
import { UpdateHeroUseCase } from './update-hero.js';

describe('UpdateHeroUseCase', () => {
  it('does not allow editing inactive heroes', async () => {
    const repository = new InMemoryHeroesRepository();
    const createHero = new CreateHeroUseCase(repository);
    const deactivateHero = new DeactivateHeroUseCase(repository);
    const updateHero = new UpdateHeroUseCase(repository);

    const hero = await createHero.execute({
      name: 'Diana Prince',
      nickname: 'Wonder Woman',
      date_of_birth: new Date('1941-10-21T00:00:00.000Z'),
      universe: 'DC',
      main_power: 'Divine strength',
      avatar_url: 'https://example.com/wonder.png'
    });

    await deactivateHero.execute(hero.id);

    await expect(updateHero.execute(hero.id, { nickname: 'Princess Diana' })).rejects.toBeInstanceOf(InactiveHeroError);
  });
});
