export interface Hero {
  id: string;
  name: string;
  nickname: string;
  date_of_birth: Date;
  universe: string;
  main_power: string;
  avatar_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHeroInput {
  name: string;
  nickname: string;
  date_of_birth: Date;
  universe: string;
  main_power: string;
  avatar_url: string;
}

export interface UpdateHeroInput {
  name?: string;
  nickname?: string;
  date_of_birth?: Date;
  universe?: string;
  main_power?: string;
  avatar_url?: string;
}
