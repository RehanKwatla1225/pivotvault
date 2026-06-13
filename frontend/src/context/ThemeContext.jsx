import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'blue', toggleTheme: () => {}, setTheme: () => {} });

const STORAGE_KEY = 'pivotvault-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'blue';
    return localStorage.getItem(STORAGE_KEY) || 'blue';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t === 'beige' ? 'beige' : 'blue');
  const toggleTheme = () => setThemeState((t) => (t === 'blue' ? 'beige' : 'blue'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
