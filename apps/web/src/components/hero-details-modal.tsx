import type * as React from 'react';
import { CalendarDays, Clock3, Shield, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { formatDate } from '@/lib/utils';
import type { Hero } from '@/types/hero';

interface HeroDetailsModalProps {
  hero: Hero | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HeroDetailsModal({ hero, open, onOpenChange }: HeroDetailsModalProps) {
  if (!hero) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <div className="grid overflow-hidden rounded-3xl md:grid-cols-[300px,1fr]">
          <div className="relative min-h-80 bg-slate-900">
            <img src={hero.avatar_url} alt={hero.nickname} className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <Badge variant={hero.is_active ? 'success' : 'danger'}>{hero.is_active ? 'Ativo' : 'Inativo'}</Badge>
              <h3 className="mt-3 text-3xl font-black text-white">{hero.nickname}</h3>
              <p className="text-sm text-slate-200">{hero.name}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader>
              <DialogTitle>Ficha do herói</DialogTitle>
              <DialogDescription>Informações completas do registro selecionado.</DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailItem icon={Shield} label="Universo" value={hero.universe} />
              <DetailItem icon={Sparkles} label="Habilidade" value={hero.main_power} />
              <DetailItem icon={CalendarDays} label="Nascimento" value={formatDate(hero.date_of_birth)} />
              <DetailItem icon={Clock3} label="Criado em" value={formatDate(hero.created_at)} />
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              <strong className="text-slate-900">Observação operacional:</strong> heróis inativos ficam preservados no banco para histórico e podem ser reativados a qualquer momento.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
