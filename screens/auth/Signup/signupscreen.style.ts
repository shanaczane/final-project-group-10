import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    appTitle: {
      fontSize: 32,
      fontFamily: 'Manrope_700Bold',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    form: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.labelText,
      marginBottom: 6,
      marginTop: 12,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
    },
    input: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.textPrimary,
    },
    eyeButton: {
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 24,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Manrope_600SemiBold',
    },
    linkRow: {
      marginTop: 24,
      alignItems: 'center',
    },
    linkText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    link: {
      color: colors.primary,
      fontFamily: 'Manrope_600SemiBold',
    },
    hintsContainer: {
      marginTop: 8,
      gap: 4,
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    hintText: {
      fontSize: 12,
      color: colors.textMuted,
    },
    hintMet: {
      color: colors.success,
    },
  });
}
