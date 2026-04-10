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
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      gap: 14,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    profileInfo: {
      flex: 1,
    },
    profileEmail: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    profileStore: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    helperBadge: {
      backgroundColor: colors.cardBackground,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helperBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    settingsCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    settingsLabel: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    signOutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.danger,
      marginTop: 8,
    },
    signOutText: {
      color: colors.danger,
      fontSize: 15,
      fontWeight: '500',
    },
  });
}
