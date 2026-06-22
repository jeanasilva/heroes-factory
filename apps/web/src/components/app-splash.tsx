import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSplashProps {
  visible: boolean;
}

export function AppSplash({ visible }: AppSplashProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 transition-opacity duration-500',
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!visible}
    >
      <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-950 to-violet-900/20" />

      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <div className="splash-logo flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm">
          <Sparkles className="h-9 w-9" strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Hero Factory</h1>
          <p className="text-sm text-slate-300 sm:text-base">Montando o seu time...</p>
        </div>

        <div className="flex items-center gap-2" aria-label="Carregando">
          <span className="splash-dot h-2 w-2 rounded-full bg-indigo-400" />
          <span className="splash-dot h-2 w-2 rounded-full bg-indigo-400" />
          <span className="splash-dot h-2 w-2 rounded-full bg-indigo-400" />
        </div>
      </div>
    </div>
  );
}
