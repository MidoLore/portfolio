import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { THEMES, DEFAULT_THEME } from './themes.js';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'portfolio-theme';

function loadSaved() {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (id && THEMES[id]) return id;
  } catch { /* storage unavailable */ }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(loadSaved);
  const theme = THEMES[themeId];

  // write the theme's colors to <html> as CSS variables before paint
  useLayoutEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.colors)) root.style.setProperty(`--${key}`, value);
    root.style.colorScheme = theme.scheme ?? 'dark';
    try { localStorage.setItem(STORAGE_KEY, themeId); } catch { /* ignore */ }
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme: setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
