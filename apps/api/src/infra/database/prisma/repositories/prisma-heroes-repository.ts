import type { Prisma } from '@prisma/client';
import type { CreateHeroInput, Hero, UpdateHeroInput } from '../../../../domain/entities/hero.js';
import type {
  HeroesRepository,
  ListHeroesParams,
  ListHeroesResult
} from '../../../../application/repositories/heroes-repository.js';
import { PrismaHeroMapper } from '../mappers/prisma-hero-mapper.js';
import { prisma } from '../prisma-client.js';

export class PrismaHeroesRepository implements HeroesRepository {
  async create(data: CreateHeroInput): Promise<Hero> {
    const hero = await prisma.hero.create({ data });
    return PrismaHeroMapper.toDomain(hero);
  }

  async findById(id: string): Promise<Hero | null> {
    const hero = await prisma.hero.findUnique({ where: { id } });
    return hero ? PrismaHeroMapper.toDomain(hero) : null;
  }

  async list({ page, perPage, search }: ListHeroesParams): Promise<ListHeroesResult> {
    const where: Prisma.HeroWhereInput = search
      ? {
          OR: [
            { name: { contains: search } },
            { nickname: { contains: search } }
          ]
        }
      : {};

    const [heroes, total] = await prisma.$transaction([
      prisma.hero.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage
      }),
      prisma.hero.count({ where })
    ]);

    return {
      heroes: heroes.map(PrismaHeroMapper.toDomain),
      total
    };
  }

  async update(id: string, data: UpdateHeroInput): Promise<Hero> {
    const hero = await prisma.hero.update({
      where: { id },
      data
    });

    return PrismaHeroMapper.toDomain(hero);
  }

  async deactivate(id: string): Promise<Hero> {
    const hero = await prisma.hero.update({
      where: { id },
      data: { is_active: false }
    });

    return PrismaHeroMapper.toDomain(hero);
  }

  async activate(id: string): Promise<Hero> {
    const hero = await prisma.hero.update({
      where: { id },
      data: { is_active: true }
    });

    return PrismaHeroMapper.toDomain(hero);
  }
}
