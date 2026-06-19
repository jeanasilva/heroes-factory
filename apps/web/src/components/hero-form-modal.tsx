import type * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { toDateInputValue } from '@/lib/utils';
import type { Hero, HeroPayload } from '@/types/hero';

const heroFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome completo.'),
  nickname: z.string().min(2, 'Informe o nome de guerra.'),
  date_of_birth: z.string().min(10, 'Informe a data de nascimento.'),
  universe: z.string().min(2, 'Informe o universo.'),
  main_power: z.string().min(2, 'Informe a habilidade principal.'),
  avatar_url: z.string().url('Informe uma URL válida para o avatar.')
});

type HeroFormValues = z.infer<typeof heroFormSchema>;

interface HeroFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  hero?: Hero | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: HeroPayload) => void;
}

const defaultValues: HeroFormValues = {
  name: '',
  nickname: '',
  date_of_birth: '',
  universe: '',
  main_power: '',
  avatar_url: ''
};

export function HeroFormModal({ open, mode, hero, isSubmitting, onOpenChange, onSubmit }: HeroFormModalProps) {
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && hero) {
      form.reset({
        name: hero.name,
        nickname: hero.nickname,
        date_of_birth: toDateInputValue(hero.date_of_birth),
        universe: hero.universe,
        main_power: hero.main_power,
        avatar_url: hero.avatar_url
      });
    } else {
      form.reset(defaultValues);
    }
  }, [form, hero, mode, open]);

  const title = mode === 'create' ? 'Criar novo herói' : 'Editar herói';
  const description =
    mode === 'create'
      ? 'Cadastre um herói com suas principais características e habilidades.'
      : 'Atualize somente os campos permitidos pelo desafio.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Nome completo" error={form.formState.errors.name?.message}>
              <Input placeholder="Robert Bruce Banner" {...form.register('name')} />
            </FormField>

            <FormField label="Nome de guerra" error={form.formState.errors.nickname?.message}>
              <Input placeholder="Hulk" {...form.register('nickname')} />
            </FormField>

            <FormField label="Data de nascimento" error={form.formState.errors.date_of_birth?.message}>
              <Input type="date" {...form.register('date_of_birth')} />
            </FormField>

            <FormField label="Universo" error={form.formState.errors.universe?.message}>
              <Input placeholder="Marvel, DC, Indie..." {...form.register('universe')} />
            </FormField>

            <FormField label="Habilidade" error={form.formState.errors.main_power?.message}>
              <Input placeholder="Super força" {...form.register('main_power')} />
            </FormField>

            <FormField label="Avatar" error={form.formState.errors.avatar_url?.message}>
              <Input placeholder="https://..." {...form.register('avatar_url')} />
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Criar herói' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      {children}
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}
