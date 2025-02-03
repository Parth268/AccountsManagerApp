// src/styles/globalStyles.js

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from './theme';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  textPrimary: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
  },
  textSecondary: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
  },
 
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
  },
});

export default globalStyles;
