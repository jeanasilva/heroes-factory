export interface Hero {
  id: string;
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroPayload {
  name: string;
  nickname: string;
  date_of_birth: string;
  universe: string;
  main_power: string;
  avatar_url: string;
}

export interface PaginatedHeroes {
  data: Hero[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
