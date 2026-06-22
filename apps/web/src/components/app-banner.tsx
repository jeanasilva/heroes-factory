import type * as React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AppBannerProps {
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
  onCreate: () => void;
}

export function AppBanner({ activeCount, inactiveCount, totalCount, onCreate }: AppBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-indigo-200/60 bg-slate-950 text-white shadow-glow dark:border-indigo-400/20">
      <div className="absolute inset-0 bg-hero-grid bg-[size:40px_40px] opacity-[0.14]" />
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative p-6 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl pr-12 sm:pr-16">
            <Badge className="mb-4 border-white/15 bg-white/10 text-white hover:bg-white/15">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Hero Factory
            </Badge>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              O lugar onde os heróis entram em cena.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Cadastre, busque e organize o time sem planilha. Tudo num painel só, do jeito que deveria ser.
            </p>
            <Button
              className="mt-6 h-12 rounded-2xl bg-white px-6 text-slate-950 hover:bg-slate-100 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              onClick={onCreate}
            >
              Cadastrar herói <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-md">
            <StatCard label="Ativos aqui" value={activeCount} />
            <StatCard label="Inativos aqui" value={inactiveCount} />
            <StatCard label="Total na busca" value={totalCount} highlight />
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function StatCard({ label, value, highlight = false }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 backdrop-blur-sm ${
        highlight ? 'border-white/25 bg-white/15' : 'border-white/10 bg-white/5'
      }`}
    >
      <p className="text-2xl font-black tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-300">{label}</p>
    </div>
  );
}
