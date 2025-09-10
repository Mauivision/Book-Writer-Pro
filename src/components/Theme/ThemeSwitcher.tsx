'use client';

import { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { ThemeMode } from '@/types/theme';

export function ThemeSwitcher() {
  const { mode, setMode, toggleDarkMode, currentTheme, customThemes, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    setIsOpen(false);
  };

  const handleThemeChange = (themeName: string) => {
    const theme = customThemes.find(t => t.name === themeName) || currentTheme;
    setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-surface text-text hover:bg-surface/80 transition-colors"
      >
        <span className="text-lg">
          {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '💻'}
        </span>
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface border border-border">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-textSecondary">Mode</div>
            <button
              onClick={() => handleModeChange('light')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface/80 transition-colors"
            >
              Light
            </button>
            <button
              onClick={() => handleModeChange('dark')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface/80 transition-colors"
            >
              Dark
            </button>
            <button
              onClick={() => handleModeChange('system')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-surface/80 transition-colors"
            >
              System
            </button>

            {customThemes.length > 0 && (
              <>
                <div className="px-4 py-2 text-sm text-textSecondary">Custom Themes</div>
                {customThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeChange(theme.name)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface/80 transition-colors"
                  >
                    {theme.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 