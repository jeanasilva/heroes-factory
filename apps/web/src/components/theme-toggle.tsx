import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'hero-factory-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.toggle('dark', isDark);
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isDark, theme]);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className="h-10 w-10 rounded-2xl bg-white/90 text-slate-900 shadow-lg ring-white/40 backdrop-blur hover:bg-white dark:bg-slate-900/85 dark:text-amber-200 dark:ring-white/10 dark:hover:bg-slate-800"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
