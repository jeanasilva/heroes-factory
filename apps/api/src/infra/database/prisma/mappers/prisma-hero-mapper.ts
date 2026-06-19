import type { Hero as PrismaHero } from '@prisma/client';
import type { Hero } from '../../../../domain/entities/hero.js';

export class PrismaHeroMapper {
  static toDomain(hero: PrismaHero): Hero {
    return {
      id: hero.id,
      name: hero.name,
      nickname: hero.nickname,
      date_of_birth: hero.date_of_birth,
      universe: hero.universe,
      main_power: hero.main_power,
      avatar_url: hero.avatar_url,
      is_active: hero.is_active,
      created_at: hero.created_at,
      updated_at: hero.updated_at
    };
  }
}
