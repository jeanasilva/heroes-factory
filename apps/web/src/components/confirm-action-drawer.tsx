import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import type { Hero } from '@/types/hero';

interface ConfirmActionDrawerProps {
  hero: Hero | null;
  action: 'deactivate' | 'activate' | null;
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmActionDrawer({
  hero,
  action,
  open,
  isSubmitting,
  onOpenChange,
  onConfirm
}: ConfirmActionDrawerProps) {
  if (!hero || !action) return null;

  const isActivate = action === 'activate';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="px-6 pb-8 pt-6" showClose={false}>
        <div className="mx-auto w-full max-w-lg">
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200" aria-hidden />

          <SheetHeader className="text-center sm:text-left">
            <SheetTitle>{isActivate ? 'Reativar herói?' : 'Excluir herói?'}</SheetTitle>
            <SheetDescription>
              {isActivate
                ? `${hero.nickname} volta para a listagem ativa e pode ser editado de novo.`
                : `${hero.nickname} sai da listagem ativa, mas o registro fica guardado. Dá para trazer de volta quando quiser.`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{hero.nickname}</p>
            <p className="text-sm text-slate-500">{hero.name}</p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant={isActivate ? 'success' : 'destructive'} onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isActivate ? 'Reativar' : 'Excluir'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
