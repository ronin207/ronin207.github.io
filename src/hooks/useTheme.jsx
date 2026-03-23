import { useState, useEffect } from 'react';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'system';
  return localStorage.getItem('theme') || 'system';
};

const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;

    const applyTheme = (t) => {
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const resolvedTheme = theme === 'system'
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return { theme, setTheme, resolvedTheme };
};

export default useTheme;
