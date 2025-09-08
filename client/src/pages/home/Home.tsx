import { useEffect, useMemo, useRef, useState } from 'react';
import viteLogo from '@/assets/vite.svg';
import reactLogo from '@/assets/react.svg';
import tailwind from '@/assets/tailwind.svg';

type ThemeName = 'light' | 'dark' | 'brand' | 'mint';
const STORAGE_KEY = 'storage-theme';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  const themes = useMemo<ThemeName[]>(
    () => ['light', 'dark', 'brand', 'mint'],
    [],
  );

  // Prefer saved theme; otherwise follow system for first load.
  const getInitialTheme = (): ThemeName => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && themes.includes(saved)) return saved;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <main className="min-h-dvh">
      {/* HERO with section-scoped theming */}
      <section
        ref={heroRef}
        data-theme={theme}
        className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background"
      >
        {/* Fixed Theme Switcher Dock (safe-area aware) */}
        <div
          className="fixed z-50"
          style={{
            insetInlineEnd: 'max(1rem, env(safe-area-inset-right))',
            insetBlockStart: 'max(1rem, env(safe-area-inset-top))',
          }}
        >
          <div
            role="tablist"
            aria-label="Theme switcher"
            className="inline-flex rounded-full bg-secondary/70 p-1 shadow-soft ring-1 ring-border backdrop-blur"
          >
            {themes.map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTheme(t)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none',
                    active
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                  title={`Theme: ${t}`}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layer 1: soft color gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 60% at 75% 25%, hsl(var(--accent) / 0.25) 0%, transparent 60%), radial-gradient(45% 45% at 20% 80%, hsl(var(--primary) / 0.18) 0%, transparent 60%)',
          }}
        />

        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 22px, hsl(var(--border)) 22px 23px), repeating-linear-gradient(90deg, transparent 0 22px, hsl(var(--border)) 22px 23px)',
          }}
        />

        <div className="container relative grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left content */}
          <div className="space-y-7">
            <span className="badge">Section-scoped theming</span>
          </div>
        </div>
      </section>
    </main>
  );
}
