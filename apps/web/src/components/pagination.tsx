import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onChangePage: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onChangePage }: PaginationProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white bg-white/80 p-4 shadow-sm sm:flex-row">
      <p className="text-sm text-slate-500">
        Página <strong className="text-slate-900">{page}</strong> de <strong className="text-slate-900">{totalPages}</strong> · {total} registro(s)
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onChangePage(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => onChangePage(page + 1)}>
          Próxima <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
