import { SearchX } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SearchX className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-black text-slate-950">Nenhum herói encontrado</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Ajuste a busca ou cadastre o primeiro herói para começar a montar a sua fábrica.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        Criar herói
      </Button>
    </div>
  );
}
