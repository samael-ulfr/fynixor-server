import { useTheme } from './ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div
      className="fixed z-50 flex gap-1 rounded-full bg-secondary/70 p-1 shadow-soft ring-1 ring-border backdrop-blur"
      style={{
        insetInlineEnd: 'max(1rem, env(safe-area-inset-right))',
        insetBlockStart: 'max(1rem, env(safe-area-inset-top))',
      }}
      role="tablist"
      aria-label="Theme switcher"
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
  );
}
