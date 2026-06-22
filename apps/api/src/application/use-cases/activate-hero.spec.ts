import { describe, expect, it } from 'vitest';
import { NotFoundError } from '../../domain/errors/not-found-error.js';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { ActivateHeroUseCase } from './activate-hero.js';
import { CreateHeroUseCase } from './create-hero.js';
import { DeactivateHeroUseCase } from './deactivate-hero.js';

describe('ActivateHeroUseCase', () => {
  it('reactivates an inactive hero', async () => {
    const repository = new InMemoryHeroesRepository();
    const createHero = new CreateHeroUseCase(repository);
    const deactivateHero = new DeactivateHeroUseCase(repository);
    const activateHero = new ActivateHeroUseCase(repository);

    const hero = await createHero.execute({
      name: 'Tony Stark',
      nickname: 'Homem de Ferro',
      date_of_birth: new Date('1970-05-29T00:00:00.000Z'),
      universe: 'Marvel',
      main_power: 'Armadura tecnológica',
      avatar_url: 'https://example.com/iron-man.png'
    });

    await deactivateHero.execute(hero.id);
    const reactivated = await activateHero.execute(hero.id);

    expect(reactivated.is_active).toBe(true);
    expect(reactivated.id).toBe(hero.id);
  });

  it('throws when hero does not exist', async () => {
    const repository = new InMemoryHeroesRepository();
    const activateHero = new ActivateHeroUseCase(repository);

    await expect(activateHero.execute('00000000-0000-4000-8000-000000000000')).rejects.toBeInstanceOf(NotFoundError);
  });
});
