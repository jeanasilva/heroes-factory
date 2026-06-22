import { Edit3, MoreHorizontal, Power, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';
import type { Hero } from '@/types/hero';

interface HeroCardProps {
  hero: Hero;
  onView: (hero: Hero) => void;
  onEdit: (hero: Hero) => void;
  onDeactivate: (hero: Hero) => void;
  onActivate: (hero: Hero) => void;
}

export function HeroCard({ hero, onView, onEdit, onDeactivate, onActivate }: HeroCardProps) {
  const isInactive = !hero.is_active;

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900/90 dark:shadow-slate-950/30 dark:hover:shadow-indigo-950/30',
        isInactive ? 'border-slate-200 opacity-90 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800/80'
      )}
    >
      <button type="button" className="block w-full text-left" onClick={() => onView(hero)}>
        <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
          <img
            src={hero.avatar_url}
            alt={hero.nickname}
            className={cn(
              'h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]',
              isInactive && 'grayscale'
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
            <Badge variant="universe">{hero.universe}</Badge>
            <Badge variant={hero.is_active ? 'success' : 'muted'}>{hero.is_active ? 'Ativo' : 'Inativo'}</Badge>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="line-clamp-1 text-lg font-black tracking-tight text-white">{hero.nickname}</h3>
            <p className="line-clamp-1 text-xs text-slate-200">{hero.name}</p>
          </div>
        </div>
      </button>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Poder principal</p>
            <p className="line-clamp-2 font-semibold text-slate-800 dark:text-slate-100">{hero.main_power}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Abrir ações do herói">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={isInactive} onClick={() => !isInactive && onEdit(hero)}>
                <Edit3 className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              {isInactive ? (
                <DropdownMenuItem onClick={() => onActivate(hero)}>
                  <Power className="h-4 w-4" /> Reativar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-rose-600 focus:text-rose-600 dark:text-rose-300 dark:focus:text-rose-200" onClick={() => onDeactivate(hero)}>
                  <Trash2 className="h-4 w-4" /> Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">Entrou em {formatDate(hero.created_at)}</p>
      </div>
    </article>
  );
}
