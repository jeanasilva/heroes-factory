import type { Hero } from '../../../domain/entities/hero.js';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateTime(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export class HeroPresenter {
  static toHTTP(hero: Hero) {
    return {
      id: hero.id,
      name: hero.name,
      nickname: hero.nickname,
      date_of_birth: formatDateTime(hero.date_of_birth),
      universe: hero.universe,
      main_power: hero.main_power,
      avatar_url: hero.avatar_url,
      is_active: hero.is_active,
      created_at: formatDateTime(hero.created_at),
      updated_at: formatDateTime(hero.updated_at)
    };
  }
}
