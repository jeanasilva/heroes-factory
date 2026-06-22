import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'muted' | 'success' | 'danger' | 'universe';
}

const variants = {
  default: 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950',
  muted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  universe: 'bg-white/90 text-slate-800 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-slate-100 dark:ring-1 dark:ring-white/10'
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variants[variant], className)}
      {...props}
    />
  );
}
