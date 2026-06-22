import { Plus, SearchX } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <SearchX className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">Nada por aqui ainda</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Nenhum herói bateu com essa busca. Tenta outro nome ou cadastra alguém novo para começar o time.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="h-4 w-4" /> Cadastrar herói
      </Button>
    </div>
  );
}
