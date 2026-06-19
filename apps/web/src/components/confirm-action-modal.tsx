import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import type { Hero } from '@/types/hero';

interface ConfirmActionModalProps {
  hero: Hero | null;
  action: 'deactivate' | 'activate' | null;
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmActionModal({ hero, action, open, isSubmitting, onOpenChange, onConfirm }: ConfirmActionModalProps) {
  if (!hero || !action) return null;

  const isActivate = action === 'activate';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isActivate ? 'Ativar herói?' : 'Desativar herói?'}</DialogTitle>
          <DialogDescription>
            {isActivate
              ? `Você está prestes a reativar ${hero.nickname}. Ele voltará a poder ser editado.`
              : `Você está prestes a desativar ${hero.nickname}. O registro ficará cinza e não poderá ser editado enquanto estiver inativo.`}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-semibold text-slate-900">{hero.nickname}</p>
          <p className="text-sm text-slate-500">{hero.name}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button variant={isActivate ? 'success' : 'destructive'} onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isActivate ? 'Ativar' : 'Desativar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
