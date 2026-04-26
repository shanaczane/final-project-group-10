import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    logoArea: {
      alignItems: 'center',
      marginBottom: 36,
    },
    logoMark: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    appTitle: {
      fontSize: 30,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 4,
    },
    form: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    formHeading: {
      fontSize: 18,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontFamily: 'Manrope_500Medium',
      color: colors.labelText,
      marginBottom: 6,
      marginTop: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
    },
    inputInner: {
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
      color: '#ffffff',
      fontSize: 15,
      fontFamily: 'Manrope_500Medium',
    },
    helperHint: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 24,
    },
    helperHintText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    ownerLink: {
      alignItems: 'center',
      marginTop: 12,
    },
    ownerLinkText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    ownerLinkAction: {
      color: colors.primary,
      fontFamily: 'Manrope_500Medium',
    },
  });
}
