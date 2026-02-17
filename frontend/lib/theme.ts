/**
 * Theme Configuration
 * Applies design tokens to create consistent theme
 */

import { colors, typography, spacing, shadows, borderRadius } from './design-tokens';

export const theme = {
  // Color palette with semantic naming
  colors: {
    // Background levels (following UI hierarchy)
    background: {
      primary: colors.neutral[950],
      secondary: colors.neutral[900],
      tertiary: colors.neutral[800],
      elevated: colors.neutral[800],
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text hierarchy
    text: {
      primary: colors.neutral[0],
      secondary: colors.neutral[300],
      tertiary: colors.neutral[400],
      disabled: colors.neutral[600],
      inverse: colors.neutral[950],
    },
    
    // Brand colors
    brand: {
      primary: colors.primary[500],
      primaryHover: colors.primary[600],
      primaryActive: colors.primary[700],
      light: colors.primary[400],
      lighter: colors.primary[300],
      lightest: colors.primary[100],
    },
    
    // Border colors
    border: {
      subtle: colors.neutral[800],
      default: colors.neutral[700],
      strong: colors.neutral[600],
      brand: colors.primary[500],
      brandSubtle: colors.primary[900],
    },
    
    // State colors
    state: {
      success: colors.success.main,
      warning: colors.warning.main,
      error: colors.error.main,
      info: colors.info.main,
    },
  },
  
  typography,
  spacing,
  shadows,
  borderRadius,
} as const;

export type Theme = typeof theme;
