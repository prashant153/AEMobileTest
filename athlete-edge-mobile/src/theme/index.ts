import { MD3LightTheme } from 'react-native-paper';
import { palette } from './colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    tertiary: palette.accent,
    surface: palette.white,
    background: palette.neutral100,
    surfaceVariant: palette.neutral200,
    onSurface: palette.neutral900,
    outline: palette.neutral300,
    error: palette.danger,
  },
  roundness: 16,
};

export type AppTheme = typeof theme;

