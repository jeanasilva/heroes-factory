import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/;

function parseDate(value: string): Date {
  const normalized = value.length === 10 ? `${value}T00:00:00.000Z` : value.replace(' ', 'T') + '.000Z';
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date.');
  }

  return date;
}

const heroFieldsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nickname: z.string().trim().min(2).max(80),
  date_of_birth: z.string().regex(dateRegex, 'Use YYYY-MM-DD or YYYY-MM-DD HH:mm:ss.').transform(parseDate),
  universe: z.string().trim().min(2).max(80),
  main_power: z.string().trim().min(2).max(120),
  avatar_url: z.string().trim().url().max(2048)
});

export const createHeroSchema = z.object({
  body: heroFieldsSchema
});

export const updateHeroSchema = z.object({
  body: heroFieldsSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be sent.'
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const heroIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const listHeroesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().max(50).default(10),
    search: z.string().trim().optional()
  })
});
