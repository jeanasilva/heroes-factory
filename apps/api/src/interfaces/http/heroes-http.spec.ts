import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { InMemoryHeroesRepository } from '../../tests/in-memory-heroes-repository.js';
import { errorHandler } from './middlewares/error-handler.js';
import { createHeroesRoutes } from './heroes-routes.js';

function buildTestApp(repository = new InMemoryHeroesRepository()) {
  const app = express();
  app.use(express.json());
  app.use(createHeroesRoutes(repository));
  app.use(errorHandler);
  return app;
}

const heroPayload = {
  name: 'Bruce Wayne',
  nickname: 'Batman',
  date_of_birth: '1939-03-30',
  universe: 'DC',
  main_power: 'Investigação e combate',
  avatar_url: 'https://example.com/batman.png'
};

describe('Heroes HTTP', () => {
  it('creates, fetches, deactivates and reactivates a hero', async () => {
    const app = buildTestApp();

    const createResponse = await request(app).post('/heroes').send(heroPayload).expect(201);

    expect(createResponse.body.nickname).toBe('Batman');
    expect(createResponse.body.is_active).toBe(true);
    expect(createResponse.body.created_at).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(createResponse.body.updated_at).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    const heroId = createResponse.body.id as string;

    const showResponse = await request(app).get(`/heroes/${heroId}`).expect(200);
    expect(showResponse.body.id).toBe(heroId);
    expect(showResponse.body.name).toBe('Bruce Wayne');

    const deactivateResponse = await request(app).delete(`/heroes/${heroId}`).expect(200);
    expect(deactivateResponse.body.is_active).toBe(false);

    const activateResponse = await request(app).patch(`/heroes/${heroId}/activate`).expect(200);
    expect(activateResponse.body.is_active).toBe(true);
  });

  it('returns 404 in portuguese when hero is missing', async () => {
    const app = buildTestApp();

    const response = await request(app)
      .get('/heroes/00000000-0000-4000-8000-000000000000')
      .expect(404);

    expect(response.body.message).toBe('Herói não encontrado.');
    expect(response.body.code).toBe('NOT_FOUND');
  });
});
