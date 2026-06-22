import type * as React from 'react';
import { CalendarDays, Clock3, Fingerprint, Globe2, ImageIcon, Link2, Shield, Sparkles, UserRound } from 'lucide-react';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { Hero } from '@/types/hero';

interface HeroDetailsDrawerProps {
  hero: Hero | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HeroDetailsDrawer({ hero, open, onOpenChange }: HeroDetailsDrawerProps) {
  if (!hero) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <div className="relative h-56 shrink-0 bg-slate-900 sm:h-64">
          <img src={hero.avatar_url} alt={hero.nickname} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute left-5 right-5 top-5">
            <Badge variant={hero.is_active ? 'success' : 'danger'}>{hero.is_active ? 'Ativo' : 'Inativo'}</Badge>
          </div>
          <div className="absolute bottom-5 left-5 right-5 pr-10">
            <h3 className="text-3xl font-black tracking-tight text-white">{hero.nickname}</h3>
            <p className="mt-1 text-sm text-slate-200">{hero.name}</p>
          </div>
        </div>

        <div className="p-6">
          <SheetHeader>
            <SheetTitle>Ficha completa</SheetTitle>
            <SheetDescription>Todos os dados retornados pela API para este herói.</SheetDescription>
          </SheetHeader>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailItem icon={Fingerprint} label="ID" value={hero.id} mono />
            <DetailItem icon={UserRound} label="Nome completo" value={hero.name} />
            <DetailItem icon={Sparkles} label="Nome de guerra" value={hero.nickname} />
            <DetailItem icon={Shield} label="Universo" value={hero.universe} />
            <DetailItem icon={Sparkles} label="Habilidade principal" value={hero.main_power} />
            <DetailItem icon={CalendarDays} label="Nascimento" value={formatDate(hero.date_of_birth)} />
            <DetailItem icon={Clock3} label="Criado em" value={formatDateTime(hero.created_at)} />
            <DetailItem icon={Clock3} label="Atualizado em" value={formatDateTime(hero.updated_at)} />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <ImageIcon className="h-4 w-4" />
              Avatar
            </div>
            <a
              href={hero.avatar_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 break-all text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <Link2 className="h-4 w-4 shrink-0" />
              {hero.avatar_url}
            </a>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200">
            <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p>Heróis excluídos continuam no histórico. Se precisar editar de novo, é só reativar pelo menu do card.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}

function DetailItem({ icon: Icon, label, value, mono = false }: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className={`text-sm font-semibold text-slate-900 ${mono ? 'break-all font-mono text-xs leading-6' : ''}`}>{value}</p>
    </div>
  );
}
