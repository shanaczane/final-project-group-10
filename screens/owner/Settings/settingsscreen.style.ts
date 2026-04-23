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

    // Profile
    profileCard: {
      alignItems: 'center',
      paddingVertical: 24,
      marginBottom: 28,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.ownerBadgeBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.ownerBadgeText,
    },
    profileName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 10,
    },
    ownerBadge: {
      backgroundColor: colors.ownerBadgeBackground,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    ownerBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.ownerBadgeText,
    },

    // Section
    sectionTitle: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 8,
      marginLeft: 4,
    },

    // List card
    listCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: 24,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 13,
      gap: 12,
    },
    listIconWrap: {
      width: 30,
      alignItems: 'center',
    },
    listLabel: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },
    listRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    listValue: {
      fontSize: 14,
      color: colors.textMuted,
      maxWidth: 140,
    },
    listDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 58,
    },
    removeBtn: {
      padding: 2,
    },

    // Modals
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    modalCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.labelText,
      marginBottom: 6,
      marginTop: 12,
    },
    fieldInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground,
    },
    pwdWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.inputBackground,
    },
    pwdInput: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.textPrimary,
    },
    eyeBtn: {
      paddingHorizontal: 12,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 20,
    },
    cancelBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.cardBackground,
    },
    cancelBtnText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    confirmBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.primary,
      minWidth: 72,
      alignItems: 'center',
    },
    confirmBtnDisabled: {
      opacity: 0.6,
    },
    confirmBtnText: {
      fontSize: 14,
      color: '#ffffff',
      fontWeight: '500',
    },
  });
}
