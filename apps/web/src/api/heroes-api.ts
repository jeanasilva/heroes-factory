import { httpClient } from './http-client';
import type { Hero, HeroPayload, PaginatedHeroes } from '@/types/hero';

interface ListHeroesParams {
  page: number;
  search?: string;
}

export async function listHeroes({ page, search }: ListHeroesParams) {
  const response = await httpClient.get<PaginatedHeroes>('/heroes', {
    params: {
      page,
      perPage: 10,
      search: search || undefined
    }
  });

  return response.data;
}

export async function createHero(payload: HeroPayload) {
  const response = await httpClient.post<Hero>('/heroes', payload);
  return response.data;
}

export async function updateHero(id: string, payload: HeroPayload) {
  const response = await httpClient.put<Hero>(`/heroes/${id}`, payload);
  return response.data;
}

export async function deactivateHero(id: string) {
  const response = await httpClient.delete<Hero>(`/heroes/${id}`);
  return response.data;
}

export async function activateHero(id: string) {
  const response = await httpClient.patch<Hero>(`/heroes/${id}/activate`);
  return response.data;
}
