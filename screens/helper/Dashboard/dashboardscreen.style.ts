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
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 24,
    },
    storeName: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    subtitle: {
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
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 28,
    },
    metricCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '500',
      marginBottom: 6,
    },
    metricValue: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    metricSub: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },
    section: {
      marginBottom: 28,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    refreshBtn: {
      padding: 4,
      width: 28,
      alignItems: 'center',
    },
    aiCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    aiErrorCard: {
      borderColor: colors.danger,
      backgroundColor: colors.dangerBackground,
      marginTop: 8,
    },
    aiLoadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    aiLoadingText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    aiErrorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    aiErrorText: {
      fontSize: 13,
      color: colors.danger,
      flex: 1,
    },
    retryBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    retryBtnText: {
      fontSize: 12,
      color: colors.danger,
      fontWeight: '500',
    },
    aiSummaryText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 21,
    },
    aiTimestamp: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 8,
    },
    queryInputRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 10,
    },
    queryInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 11,
      fontSize: 14,
      color: colors.textPrimary,
    },
    askBtn: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    askBtnDisabled: {
      opacity: 0.5,
    },
    askBtnText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
    alertRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.dangerBackground,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 6,
    },
    alertLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    alertDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.danger,
    },
    alertName: {
      fontSize: 14,
      color: colors.dangerText,
      fontWeight: '500',
      flex: 1,
    },
    alertQty: {
      fontSize: 13,
      color: colors.dangerText,
      fontWeight: '500',
    },
    weeklyTable: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    weeklyHeader: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    weeklyRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    weeklyRowAlt: {
      backgroundColor: colors.cardBackground,
    },
    weeklyCell: {
      flex: 1,
      fontSize: 13,
      color: colors.textPrimary,
    },
    weeklyHeadText: {
      color: colors.textMuted,
      fontWeight: '500',
      fontSize: 12,
    },
    weeklyRight: {
      textAlign: 'right',
    },
    weeklyAmount: {
      color: colors.success,
      fontWeight: '500',
    },
    movementRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    movementLeft: {
      flex: 1,
    },
    movementProduct: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    movementDate: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    movementQty: {
      fontSize: 15,
      fontWeight: '500',
    },
    movementSale: {
      color: colors.danger,
    },
    movementRestock: {
      color: colors.success,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: 16,
    },
  });
}
