import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('pugi_theme') as Theme | null;
    return stored || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    theme === 'system' ? getSystemTheme() : theme
  );

  useEffect(() => {
    const applyResolved = () => {
      const resolved = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    applyResolved();
    localStorage.setItem('pugi_theme', theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyResolved();
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(
    () => setThemeState((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light')),
    []
  );

  const value = useMemo(
    () => ({ theme, resolvedTheme, toggleTheme, setTheme }),
    [theme, resolvedTheme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
