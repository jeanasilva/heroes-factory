import { Router } from 'express';
import type { HeroesRepository } from '../../application/repositories/heroes-repository.js';
import { HeroesController } from './controllers/heroes-controller.js';
import { asyncHandler } from './middlewares/async-handler.js';

export function createHeroesRoutes(heroesRepository: HeroesRepository) {
  const routes = Router();
  const heroesController = new HeroesController(heroesRepository);

  routes.get('/heroes', asyncHandler((request, response) => heroesController.list(request, response)));
  routes.get('/heroes/:id', asyncHandler((request, response) => heroesController.show(request, response)));
  routes.post('/heroes', asyncHandler((request, response) => heroesController.create(request, response)));
  routes.put('/heroes/:id', asyncHandler((request, response) => heroesController.update(request, response)));
  routes.delete('/heroes/:id', asyncHandler((request, response) => heroesController.deactivate(request, response)));
  routes.patch('/heroes/:id/activate', asyncHandler((request, response) => heroesController.activate(request, response)));

  return routes;
}
