import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const heroes = [
  {
    id: 'e314636e-1ca6-4925-a0e7-da5eb5ae2403',
    name: 'Robert Bruce Banner',
    nickname: 'Hulk',
    date_of_birth: new Date('1962-04-10T00:00:00.000Z'),
    universe: 'Marvel',
    main_power: 'Super strength',
    avatar_url: 'https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg',
    is_active: true
  },
  {
    id: '2de846bb-67de-4264-b7bb-203b1d849e7d',
    name: 'Diana Prince',
    nickname: 'Wonder Woman',
    date_of_birth: new Date('1941-10-21T00:00:00.000Z'),
    universe: 'DC',
    main_power: 'Divine strength',
    avatar_url: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=1200&auto=format&fit=crop',
    is_active: true
  },
  {
    id: '0a0acfe1-d3b4-4c02-a181-e0f90f233cd1',
    name: 'Peter Parker',
    nickname: 'Spider-Man',
    date_of_birth: new Date('1962-08-10T00:00:00.000Z'),
    universe: 'Marvel',
    main_power: 'Spider sense',
    avatar_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1200&auto=format&fit=crop',
    is_active: true
  },
  {
    id: 'a65d2a04-cf9d-4ce4-b573-02d9b03c0f4e',
    name: 'Clark Kent',
    nickname: 'Superman',
    date_of_birth: new Date('1938-06-01T00:00:00.000Z'),
    universe: 'DC',
    main_power: 'Solar energy absorption',
    avatar_url: 'https://images.unsplash.com/photo-1623984109622-f9c970ba32fc?q=80&w=1200&auto=format&fit=crop',
    is_active: false
  }
];

async function main() {
  await Promise.all(
    heroes.map((hero) =>
      prisma.hero.upsert({
        where: { id: hero.id },
        update: hero,
        create: hero
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
