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
  dangerBackground: string;
  dangerText: string;
}

export const lightColors: Colors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#4F46E5',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  inputBackground: '#F9FAFB',
  labelText: '#374151',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  dangerBackground: '#FEE2E2',
  dangerText: '#DC2626',
};

export const darkColors: Colors = {
  background: '#111827',
  surface: '#1F2937',
  primary: '#818CF8',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#374151',
  inputBackground: '#374151',
  labelText: '#D1D5DB',
  tabBar: '#1F2937',
  tabBarBorder: '#374151',
  dangerBackground: '#450a0a',
  dangerText: '#FCA5A5',
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
