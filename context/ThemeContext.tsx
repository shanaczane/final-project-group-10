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
  surfaceAlt: string;
  borderStrong: string;
  accentSoft: string;
  chipBg: string;
}

export const lightColors: Colors = {
  background: '#F8F4EE',
  surface: '#FFFFFF',
  primary: '#E07A5F',
  textPrimary: '#1F1A14',
  textSecondary: '#5C5246',
  textMuted: '#9A8E7E',
  border: '#E8DFD2',
  inputBackground: '#F1ECE3',
  labelText: '#5C5246',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E8DFD2',
  danger: '#C75A4F',
  dangerBackground: '#F8DDD9',
  dangerText: '#B85040',
  success: '#4A8F6B',
  successBackground: '#DCEEDF',
  warning: '#D89B4A',
  warningBackground: '#F8E8CC',
  info: '#E07A5F',
  cardBackground: '#F1ECE3',
  ownerBadgeBackground: '#FBE5DD',
  ownerBadgeText: '#B85940',
  surfaceAlt: '#F1ECE3',
  borderStrong: '#D4C7B3',
  accentSoft: '#FBE5DD',
  chipBg: '#EFE7DA',
};

export const darkColors: Colors = {
  background: '#15110C',
  surface: '#1F1A14',
  primary: '#E89074',
  textPrimary: '#F5EFE3',
  textSecondary: '#B5A892',
  textMuted: '#7A6F5E',
  border: '#332A1F',
  inputBackground: '#2A2218',
  labelText: '#B5A892',
  tabBar: '#1F1A14',
  tabBarBorder: '#332A1F',
  danger: '#E07670',
  dangerBackground: '#3A1E1B',
  dangerText: '#F09890',
  success: '#7BBF92',
  successBackground: '#1E2E25',
  warning: '#E0B370',
  warningBackground: '#332817',
  info: '#E89074',
  cardBackground: '#2A2218',
  ownerBadgeBackground: '#3A2218',
  ownerBadgeText: '#E89074',
  surfaceAlt: '#2A2218',
  borderStrong: '#473C2D',
  accentSoft: '#3A2218',
  chipBg: '#2A2218',
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
      if (saved !== null) setIsDark(saved === 'dark');
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
