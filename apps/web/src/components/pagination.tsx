import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  isLoading?: boolean;
  onChangePage: (page: number) => void;
}

export function Pagination({ page, totalPages, total, isLoading = false, onChangePage }: PaginationProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white bg-white/80 p-4 shadow-sm sm:flex-row">
      <p className="text-sm text-slate-500">
        Página <strong className="text-slate-900">{page}</strong> de <strong className="text-slate-900">{totalPages}</strong> ·{' '}
        {total} {total === 1 ? 'herói' : 'heróis'}
        {isLoading && (
          <span className="ml-2 inline-flex items-center gap-1 text-indigo-600">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            carregando
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 1 || isLoading} onClick={() => onChangePage(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button variant="secondary" disabled={page >= totalPages || isLoading} onClick={() => onChangePage(page + 1)}>
          Próxima <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
