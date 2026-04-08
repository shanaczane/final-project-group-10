import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';

export interface Colors {
  background: string;
  surface: string;
  primary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  inputBackground: string;
  labelText: string;
  tabBar: string;
  tabBarBorder: string;
  danger: string;
  dangerBackground: string;
  dangerText: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  info: string;
  cardBackground: string;
  ownerBadgeBackground: string;
  ownerBadgeText: string;
}

export const lightColors: Colors = {
  background: '#fafaf9',
  surface: '#ffffff',
  primary: '#185FA5',
  textPrimary: '#111110',
  textSecondary: '#555553',
  textMuted: '#888886',
  border: '#e0e0de',
  inputBackground: '#f2f2f0',
  labelText: '#333331',
  tabBar: '#ffffff',
  tabBarBorder: '#e0e0de',
  danger: '#c73030',
  dangerBackground: '#fde8e8',
  dangerText: '#c73030',
  success: '#4a8f1e',
  successBackground: '#e8f5df',
  warning: '#c47d1a',
  warningBackground: '#fef3e0',
  info: '#185FA5',
  cardBackground: '#f2f2f0',
  ownerBadgeBackground: '#dbeafe',
  ownerBadgeText: '#185FA5',
};

export const darkColors: Colors = {
  background: '#1c1c1a',
  surface: '#2a2a28',
  primary: '#4a8fd4',
  textPrimary: '#f2f2f0',
  textSecondary: '#a0a09e',
  textMuted: '#666664',
  border: '#3a3a38',
  inputBackground: '#333331',
  labelText: '#c8c8c6',
  tabBar: '#1c1c1a',
  tabBarBorder: '#3a3a38',
  danger: '#e05050',
  dangerBackground: '#3a1010',
  dangerText: '#f08080',
  success: '#6abf3a',
  successBackground: '#1a2e10',
  warning: '#d49030',
  warningBackground: '#2e2010',
  info: '#4a8fd4',
  cardBackground: '#2a2a28',
  ownerBadgeBackground: '#1e3a5f',
  ownerBadgeText: '#4a8fd4',
};

const THEME_STORAGE_KEY = 'app_theme';

interface ThemeContextType {
  colors: Colors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    });
  }, []);

  function toggleTheme(): void {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
