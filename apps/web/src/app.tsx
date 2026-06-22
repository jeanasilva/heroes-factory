import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { activateHero, createHero, deactivateHero, listHeroes, updateHero } from './api/heroes-api';
import { AppBanner } from './components/app-banner';
import { AppSplash } from './components/app-splash';
import { ConfirmActionDrawer } from './components/confirm-action-drawer';
import { EmptyState } from './components/empty-state';
import { HeroCard } from './components/hero-card';
import { HeroDetailsDrawer } from './components/hero-details-drawer';
import { HeroFormDrawer } from './components/hero-form-drawer';
import { HeroGridSkeleton } from './components/hero-grid-skeleton';
import { Pagination } from './components/pagination';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useDebounce } from './hooks/use-debounce';
import type { Hero, HeroPayload } from './types/hero';

const API_ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'Herói não encontrado.',
  INACTIVE_HERO: 'Heróis inativos não podem ser editados.',
  VALIDATION_ERROR: 'Confira os dados enviados.',
  INTERNAL_SERVER_ERROR: 'Algo deu errado no servidor. Tente de novo.'
};

const SPLASH_MIN_MS = 800;
const SPLASH_MAX_MS = 3200;

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    const message = typeof data?.message === 'string' ? data.message : null;
    const code = typeof data?.code === 'string' ? data.code : null;

    if (message) return message;
    if (code && API_ERROR_MESSAGES[code]) return API_ERROR_MESSAGES[code];
  }

  return 'Não deu para concluir. Tenta outra vez?';
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
  const [splashVisible, setSplashVisible] = useState(true);
  const [appReadyAt, setAppReadyAt] = useState<number | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const heroesQuery = useQuery({
    queryKey: ['heroes', page, debouncedSearch],
    queryFn: () => listHeroes({ page, search: debouncedSearch })
  });

  const isInitialLoading = heroesQuery.isLoading;
  const isRefreshing = heroesQuery.isFetching && !heroesQuery.isLoading;

  useEffect(() => {
    if (heroesQuery.isLoading) return;
    setAppReadyAt(Date.now());
  }, [heroesQuery.isLoading]);

  useEffect(() => {
    if (appReadyAt === null) return;

    const elapsed = Date.now() - appReadyAt;
    const delay = Math.max(SPLASH_MIN_MS - elapsed, 0);
    const timer = window.setTimeout(() => setSplashVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [appReadyAt]);

  useEffect(() => {
    const fallback = window.setTimeout(() => setSplashVisible(false), SPLASH_MAX_MS);
    return () => window.clearTimeout(fallback);
  }, []);

  const invalidateHeroes = async () => {
    await queryClient.invalidateQueries({ queryKey: ['heroes'] });
  };

  const createMutation = useMutation({
    mutationFn: createHero,
    onSuccess: async () => {
      toast.success('Herói cadastrado. Bem-vindo ao time!');
      setFormOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: HeroPayload }) => updateHero(id, payload),
    onSuccess: async () => {
      toast.success('Alterações salvas.');
      setFormOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateHero,
    onSuccess: async () => {
      toast.success('Herói excluído da listagem ativa.');
      setConfirmOpen(false);
      await invalidateHeroes();
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  const activateMutation = useMutation({
    mutationFn: activateHero,
    onSuccess: async () => {
      toast.success('Herói de volta ao time.');
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
    <>
      <AppSplash visible={splashVisible} />

      <main className={`min-h-screen bg-slate-50 transition-opacity duration-500 ${splashVisible ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AppBanner
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            totalCount={meta?.total ?? 0}
            onCreate={handleCreate}
          />

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">Heróis cadastrados</h2>
                <p className="text-sm text-slate-500">Do mais recente para o mais antigo.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Busca por nome ou apelido..."
                    className="pl-11"
                    aria-busy={isRefreshing}
                  />
                  {isRefreshing && (
                    <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-500" />
                  )}
                </div>
                <Button className="h-11 shrink-0 rounded-2xl px-5 sm:hidden" onClick={handleCreate}>
                  <Plus className="h-4 w-4" /> Novo herói
                </Button>
              </div>
            </div>
          </div>

          <section className="relative mt-6">
            {isRefreshing && (
              <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl bg-white/50 backdrop-blur-[1px]" />
            )}

            {isInitialLoading ? (
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
              <Pagination
                page={meta.page}
                total={meta.total}
                totalPages={meta.totalPages}
                isLoading={isRefreshing}
                onChangePage={setPage}
              />
            )}
          </section>
        </div>

        <HeroFormDrawer
          open={formOpen}
          mode={formMode}
          hero={selectedHero}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onOpenChange={setFormOpen}
          onSubmit={handleFormSubmit}
        />

        <HeroDetailsDrawer hero={selectedHero} open={detailsOpen} onOpenChange={setDetailsOpen} />

        <ConfirmActionDrawer
          hero={selectedHero}
          action={confirmAction}
          open={confirmOpen}
          isSubmitting={deactivateMutation.isPending || activateMutation.isPending}
          onOpenChange={setConfirmOpen}
          onConfirm={handleConfirmAction}
        />
      </main>
    </>
  );
}
