// src/context/ThemeContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeName = 'light' | 'dark' | 'brand' | 'mint';
const STORAGE_KEY = 'storage-theme';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  themes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themes = useMemo<ThemeName[]>(
    () => ['light', 'dark', 'brand', 'mint'],
    [],
  );

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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
