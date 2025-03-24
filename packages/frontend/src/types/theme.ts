export type ThemeMode = 'light' | 'dark';

export interface ThemePreferences {
  mode: ThemeMode;
  systemPreference: boolean;
}

export interface ThemeContextType {
  theme: ThemeMode;
  preferences: ThemePreferences;
  setTheme: (mode: ThemeMode) => void;
  setSystemPreference: (useSystem: boolean) => void;
  toggleTheme: () => void;
}
