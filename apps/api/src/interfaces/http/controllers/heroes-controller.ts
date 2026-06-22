import type { Request, Response } from 'express';
import { ActivateHeroUseCase } from '../../../application/use-cases/activate-hero.js';
import { CreateHeroUseCase } from '../../../application/use-cases/create-hero.js';
import { DeactivateHeroUseCase } from '../../../application/use-cases/deactivate-hero.js';
import { GetHeroByIdUseCase } from '../../../application/use-cases/get-hero-by-id.js';
import { ListHeroesUseCase } from '../../../application/use-cases/list-heroes.js';
import { UpdateHeroUseCase } from '../../../application/use-cases/update-hero.js';
import type { HeroesRepository } from '../../../application/repositories/heroes-repository.js';
import { HeroPresenter } from '../presenters/hero-presenter.js';
import {
  createHeroSchema,
  heroIdParamsSchema,
  listHeroesSchema,
  updateHeroSchema
} from '../validators/hero-schemas.js';

export class HeroesController {
  constructor(private readonly heroesRepository: HeroesRepository) {}

  async create(request: Request, response: Response) {
    const { body } = createHeroSchema.parse({ body: request.body });
    const createHero = new CreateHeroUseCase(this.heroesRepository);
    const hero = await createHero.execute(body);

    return response.status(201).json(HeroPresenter.toHTTP(hero));
  }

  async list(request: Request, response: Response) {
    const { query } = listHeroesSchema.parse({ query: request.query });
    const listHeroes = new ListHeroesUseCase(this.heroesRepository);
    const result = await listHeroes.execute(query);

    return response.json({
      data: result.data.map(HeroPresenter.toHTTP),
      meta: result.meta
    });
  }

  async show(request: Request, response: Response) {
    const { params } = heroIdParamsSchema.parse({ params: request.params });
    const getHeroById = new GetHeroByIdUseCase(this.heroesRepository);
    const hero = await getHeroById.execute(params.id);

    return response.json(HeroPresenter.toHTTP(hero));
  }

  async update(request: Request, response: Response) {
    const { body, params } = updateHeroSchema.parse({ body: request.body, params: request.params });
    const updateHero = new UpdateHeroUseCase(this.heroesRepository);
    const hero = await updateHero.execute(params.id, body);

    return response.json(HeroPresenter.toHTTP(hero));
  }

  async deactivate(request: Request, response: Response) {
    const { params } = heroIdParamsSchema.parse({ params: request.params });
    const deactivateHero = new DeactivateHeroUseCase(this.heroesRepository);
    const hero = await deactivateHero.execute(params.id);

    return response.json(HeroPresenter.toHTTP(hero));
  }

  async activate(request: Request, response: Response) {
    const { params } = heroIdParamsSchema.parse({ params: request.params });
    const activateHero = new ActivateHeroUseCase(this.heroesRepository);
    const hero = await activateHero.execute(params.id);

    return response.json(HeroPresenter.toHTTP(hero));
  }
}
