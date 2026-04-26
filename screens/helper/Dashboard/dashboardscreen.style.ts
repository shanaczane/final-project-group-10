import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 40,
    },

    // Header
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
    },
    helloText: {
      fontSize: 26,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    avatarBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarBadgeText: {
      fontSize: 13,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textSecondary,
    },

    // Sales Today card
    salesTodayCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    salesTodayLabel: {
      fontSize: 11,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textMuted,
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    salesTodayAmount: {
      fontSize: 32,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    salesTodayUnits: {
      fontSize: 13,
      color: colors.textMuted,
    },

    // Quick action cards
    actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 28,
    },
    actionCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    actionTitle: {
      fontSize: 14,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    actionSub: {
      fontSize: 12,
      color: colors.textMuted,
    },

    // Recent Activity
    activityHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    activityLabel: {
      fontSize: 11,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    viewAllText: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: 'Manrope_500Medium',
    },
    activityCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    activityRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityIconSale: {
      backgroundColor: colors.dangerBackground,
    },
    activityIconRestock: {
      backgroundColor: colors.successBackground,
    },
    activityInfo: {
      flex: 1,
    },
    activityProduct: {
      fontSize: 14,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
    },
    activityTime: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 1,
    },
    activityQty: {
      fontSize: 15,
      fontFamily: 'Manrope_600SemiBold',
    },
    activityQtySale: {
      color: colors.danger,
    },
    activityQtyRestock: {
      color: colors.success,
    },

    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: 20,
    },

    // Modal
    modalContainer: {
      flex: 1,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textPrimary,
    },
    modalList: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 40,
    },
  });
}
