import { Platform } from 'react-native';

/**
 * Material Design typography – Roboto-style
 * Use 'Roboto' after loading via expo-font or Google Fonts (web).
 * Fallback: system-ui on web, system on native.
 */
const fontFamily = Platform.select({
  web: '"Roboto", "Helvetica Neue", system-ui, sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily,
  // Scale
  headlineLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  labelLarge: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
};

export default typography;
