import type * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Plus, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { activateHero, createHero, deactivateHero, listHeroes, updateHero } from './api/heroes-api';
import { ConfirmActionModal } from './components/confirm-action-modal';
import { EmptyState } from './components/empty-state';
import { HeroCard } from './components/hero-card';
import { HeroDetailsModal } from './components/hero-details-modal';
import { HeroFormModal } from './components/hero-form-modal';
import { HeroGridSkeleton } from './components/hero-grid-skeleton';
import { Pagination } from './components/pagination';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useDebounce } from './hooks/use-debounce';
import type { Hero, HeroPayload } from './types/hero';

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    return typeof message === 'string' ? message : 'Não foi possível concluir a ação.';
  }

  return 'Não foi possível concluir a ação.';
}

export function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const heroesQuery = useQuery({
    queryKey: ['heroes', page, debouncedSearch],
    queryFn: () => listHeroes({ page, search: debouncedSearch })
  });

  const invalidateHeroes = async () => {
    await queryClient.invalidateQueries({ queryKey: ['heroes'] });
  };

  const createMutation = useMutation({
    mutationFn: createHero,
    onSuccess: async () => {
      toast.success('Herói criado com sucesso.');
      setFormOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: HeroPayload }) => updateHero(id, payload),
    onSuccess: async () => {
      toast.success('Herói atualizado com sucesso.');
      setFormOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateHero,
    onSuccess: async () => {
      toast.success('Herói desativado com sucesso.');
      setConfirmOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const activateMutation = useMutation({
    mutationFn: activateHero,
    onSuccess: async () => {
      toast.success('Herói ativado com sucesso.');
      setConfirmOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const heroes = heroesQuery.data?.data ?? [];
  const meta = heroesQuery.data?.meta;

  const activeCount = heroes.filter((hero) => hero.is_active).length;
  const inactiveCount = heroes.filter((hero) => !hero.is_active).length;

  function handleCreate() {
    setSelectedHero(null);
    setFormMode('create');
    setFormOpen(true);
  }

  function handleEdit(hero: Hero) {
    setSelectedHero(hero);
    setFormMode('edit');
    setFormOpen(true);
  }

  function handleView(hero: Hero) {
    setSelectedHero(hero);
    setDetailsOpen(true);
  }

  function handleDeactivate(hero: Hero) {
    setSelectedHero(hero);
    setConfirmAction('deactivate');
    setConfirmOpen(true);
  }

  function handleActivate(hero: Hero) {
    setSelectedHero(hero);
    setConfirmAction('activate');
    setConfirmOpen(true);
  }

  function handleFormSubmit(payload: HeroPayload) {
    if (formMode === 'create') {
      createMutation.mutate(payload);
      return;
    }

    if (selectedHero) {
      updateMutation.mutate({ id: selectedHero.id, payload });
    }
  }

  function handleConfirmAction() {
    if (!selectedHero || !confirmAction) return;

    if (confirmAction === 'activate') {
      activateMutation.mutate(selectedHero.id);
      return;
    }

    deactivateMutation.mutate(selectedHero.id);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 bg-hero-grid bg-[size:36px_36px]">
      <section className="relative isolate">
        <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-glow backdrop-blur md:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Badge className="mb-4" variant="default">
                  <Sparkles className="mr-1 h-3.5 w-3.5" /> Hero Factory
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Gestão de heróis com clareza, velocidade e controle.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Cadastre, visualize, edite, desative e reative heróis em uma experiência simples, responsiva e preparada para uso real.
                </p>
              </div>

              <Button className="h-12 rounded-2xl px-6" onClick={handleCreate}>
                <Plus className="h-5 w-5" /> Novo herói
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <MetricCard icon={ShieldCheck} label="Ativos nesta página" value={activeCount} />
              <MetricCard icon={Zap} label="Inativos nesta página" value={inactiveCount} />
              <MetricCard icon={Sparkles} label="Total encontrado" value={meta?.total ?? 0} />
            </div>
          </header>

          <div className="mt-8 rounded-[2rem] border border-white bg-white/80 p-4 shadow-sm backdrop-blur md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Heróis cadastrados</h2>
                <p className="text-sm text-slate-500">Ordenados por criação, do mais recente para o mais antigo.</p>
              </div>
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome ou apelido"
                  className="pl-11"
                />
              </div>
            </div>
          </div>

          <section className="mt-6">
            {heroesQuery.isLoading ? (
              <HeroGridSkeleton />
            ) : heroes.length === 0 ? (
              <EmptyState onCreate={handleCreate} />
            ) : (
              <div className="hero-card-grid grid gap-5">
                {heroes.map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDeactivate={handleDeactivate}
                    onActivate={handleActivate}
                  />
                ))}
              </div>
            )}

            {meta && meta.total > 0 && (
              <Pagination page={meta.page} total={meta.total} totalPages={meta.totalPages} onChangePage={setPage} />
            )}
          </section>
        </div>
      </section>

      <HeroFormModal
        open={formOpen}
        mode={formMode}
        hero={selectedHero}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
      />

      <HeroDetailsModal hero={selectedHero} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <ConfirmActionModal
        hero={selectedHero}
        action={confirmAction}
        open={confirmOpen}
        isSubmitting={deactivateMutation.isPending || activateMutation.isPending}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmAction}
      />
    </main>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
