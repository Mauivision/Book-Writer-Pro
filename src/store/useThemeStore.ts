import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeMode, ThemeState } from '@/types/theme';

const defaultTheme: Theme = {
  name: 'Default',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  }
};

const darkTheme: Theme = {
  ...defaultTheme,
  name: 'Dark',
  colors: {
    ...defaultTheme.colors,
    background: '#1F2937',
    surface: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563'
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      currentTheme: defaultTheme,
      customThemes: [],
      setMode: (mode: ThemeMode) => set({ mode }),
      setTheme: (theme: Theme) => set({ currentTheme: theme }),
      addCustomTheme: (theme: Theme) =>
        set((state) => ({
          customThemes: [...state.customThemes, theme]
        })),
      removeCustomTheme: (themeName: string) =>
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.name !== themeName)
        })),
      toggleDarkMode: () =>
        set((state) => ({
          currentTheme: state.currentTheme.name === 'Default' ? darkTheme : defaultTheme
        }))
    }),
    {
      name: 'theme-storage'
    }
  )
); 