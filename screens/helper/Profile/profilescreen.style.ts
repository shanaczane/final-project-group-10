import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 40,
    },

    // Page title
    pageTitle: {
      fontSize: 26,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
      marginBottom: 24,
    },

    // Profile card — centered
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      alignItems: 'center',
      marginBottom: 28,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 22,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textSecondary,
    },
    profileEmail: {
      fontSize: 15,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    profileStore: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 10,
    },
    helperBadge: {
      backgroundColor: colors.cardBackground,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helperBadgeText: {
      fontSize: 11,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },

    // Section title
    sectionTitle: {
      fontSize: 11,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textMuted,
      letterSpacing: 0.8,
      marginBottom: 8,
      marginLeft: 4,
    },

    // Settings card
    settingsCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: 14,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    settingsIcon: {
      width: 20,
      textAlign: 'center',
    },
    settingsLabel: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },

    // Sign out row
    signOutRow: {},
    signOutText: {
      flex: 1,
      fontSize: 15,
      color: colors.danger,
    },
  });
}
