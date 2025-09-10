'use client';

import { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { Theme, ThemeColors } from '@/types/theme';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-textSecondary w-24">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2 py-1 text-sm border rounded bg-surface text-text"
      />
    </div>
  );
}

export function ThemeCustomizer() {
  const { currentTheme, addCustomTheme } = useThemeStore();
  const [themeName, setThemeName] = useState('');
  const [colors, setColors] = useState<ThemeColors>(currentTheme.colors);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveTheme = () => {
    if (!themeName) return;

    const newTheme: Theme = {
      ...currentTheme,
      name: themeName,
      colors
    };

    addCustomTheme(newTheme);
    setThemeName('');
  };

  return (
    <div className="p-4 space-y-4 bg-surface rounded-lg shadow">
      <h3 className="text-lg font-semibold text-text">Customize Theme</h3>
      
      <div className="space-y-2">
        <label className="block text-sm text-textSecondary">Theme Name</label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          placeholder="Enter theme name"
          className="w-full px-3 py-2 border rounded bg-surface text-text"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-textSecondary">Colors</h4>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Primary"
            value={colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
          />
          <ColorPicker
            label="Secondary"
            value={colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
          />
          <ColorPicker
            label="Accent"
            value={colors.accent}
            onChange={(value) => handleColorChange('accent', value)}
          />
          <ColorPicker
            label="Background"
            value={colors.background}
            onChange={(value) => handleColorChange('background', value)}
          />
          <ColorPicker
            label="Surface"
            value={colors.surface}
            onChange={(value) => handleColorChange('surface', value)}
          />
          <ColorPicker
            label="Text"
            value={colors.text}
            onChange={(value) => handleColorChange('text', value)}
          />
          <ColorPicker
            label="Text Secondary"
            value={colors.textSecondary}
            onChange={(value) => handleColorChange('textSecondary', value)}
          />
          <ColorPicker
            label="Border"
            value={colors.border}
            onChange={(value) => handleColorChange('border', value)}
          />
        </div>
      </div>

      <button
        onClick={handleSaveTheme}
        disabled={!themeName}
        className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Save Theme
      </button>
    </div>
  );
} 