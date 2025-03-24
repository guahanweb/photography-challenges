import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { ThemeContextType, ThemeMode, ThemePreferences } from '../types/theme';

const THEME_STORAGE_KEY = 'theme_preferences';

const initialState: ThemePreferences = {
  mode: 'light',
  systemPreference: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeAction =
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_SYSTEM_PREFERENCE'; payload: boolean };

function themeReducer(state: ThemePreferences, action: ThemeAction): ThemePreferences {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, mode: action.payload };
    case 'SET_SYSTEM_PREFERENCE':
      return { ...state, systemPreference: action.payload };
    default:
      return state;
  }
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeClass(theme: ThemeMode) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, dispatch] = useReducer(themeReducer, initialState);

  // Load saved preferences and apply theme on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      dispatch({ type: 'SET_THEME', payload: parsed.mode });
      dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: parsed.systemPreference });
      // Apply theme immediately when loading saved preferences
      const theme = parsed.systemPreference ? getSystemTheme() : parsed.mode;
      applyThemeClass(theme);
    } else {
      // Apply default theme if no saved preferences
      const theme = initialState.systemPreference ? getSystemTheme() : initialState.mode;
      applyThemeClass(theme);
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preferences.systemPreference) {
        const newTheme = getSystemTheme();
        dispatch({ type: 'SET_THEME', payload: newTheme });
        applyThemeClass(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.systemPreference]);

  // Apply theme class when preferences change
  useEffect(() => {
    const theme = preferences.systemPreference ? getSystemTheme() : preferences.mode;
    applyThemeClass(theme);
  }, [preferences.mode, preferences.systemPreference]);

  const setTheme = useCallback((mode: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: mode });
    dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: false });
  }, []);

  const setSystemPreference = useCallback((useSystem: boolean) => {
    dispatch({ type: 'SET_SYSTEM_PREFERENCE', payload: useSystem });
    if (useSystem) {
      const newTheme = getSystemTheme();
      dispatch({ type: 'SET_THEME', payload: newTheme });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = preferences.mode === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [preferences.mode, setTheme]);

  const theme = preferences.systemPreference ? getSystemTheme() : preferences.mode;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        preferences,
        setTheme,
        setSystemPreference,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
