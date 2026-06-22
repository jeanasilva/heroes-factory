import { Router } from 'express';
import { PrismaHeroesRepository } from '../../infra/database/prisma/repositories/prisma-heroes-repository.js';
import { createDocsRoutes } from './docs/docs-routes.js';
import { createHeroesRoutes } from './heroes-routes.js';

const routes = Router();

routes.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

routes.use(createDocsRoutes());
routes.use(createHeroesRoutes(new PrismaHeroesRepository()));

export { routes };
