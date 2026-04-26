import { StyleSheet } from 'react-native';
import type { Colors } from '../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
      marginRight: 12,
    },
    closeBtn: {
      padding: 4,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    // Status badge
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 20,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    statusText: {
      fontSize: 13,
      fontFamily: 'Manrope_500Medium',
    },
    statusGreen: {
      backgroundColor: colors.successBackground,
    },
    statusAmber: {
      backgroundColor: colors.warningBackground,
    },
    statusRed: {
      backgroundColor: colors.dangerBackground,
    },
    statusTextGreen: {
      color: colors.success,
    },
    statusTextAmber: {
      color: colors.warning,
    },
    statusTextRed: {
      color: colors.danger,
    },
    // Stock highlight card
    stockCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      overflow: 'hidden',
    },
    stockItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 18,
      gap: 4,
    },
    stockDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
    },
    stockValue: {
      fontSize: 22,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
    },
    stockLabel: {
      fontSize: 11,
      color: colors.textMuted,
    },
    profitPositive: {
      color: colors.success,
    },
    profitNegative: {
      color: colors.danger,
    },
    // Details card
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
      overflow: 'hidden',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textMuted,
    },
    infoValue: {
      fontSize: 14,
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    // Actions
    actions: {
      gap: 10,
    },
    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
    },
    editBtnText: {
      color: '#ffffff',
      fontSize: 15,
      fontFamily: 'Manrope_500Medium',
    },
    deleteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 12,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    deleteBtnText: {
      color: colors.danger,
      fontSize: 15,
      fontFamily: 'Manrope_500Medium',
    },
  });
}
