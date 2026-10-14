'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { cn } from '@/lib/utils';

const themes: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const buttonClass = cn(
  'flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200',
  'text-neutral-500 transition-colors hover:border-neutral-300 hover:text-primary',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
);

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={buttonClass} aria-hidden="true" />;
  }

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        const order: Theme[] = ['system', 'light', 'dark'];
        const index = order.indexOf(theme);
        const next = order[(index + 1) % order.length];
        setTheme(next);
      }}
      className={buttonClass}
      aria-label={`Current theme: ${currentTheme.label}. Click to cycle theme.`}
      title={`Current theme: ${currentTheme.label}. Click to cycle theme.`}
    >
      {theme === 'system' ? (
        <ComputerDesktopIcon className="h-4 w-4" />
      ) : theme === 'dark' ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
    </button>
  );
}
