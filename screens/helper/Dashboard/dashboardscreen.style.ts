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
    sectionTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    aiSection: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 28,
      overflow: 'hidden',
    },
    aiCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    aiCardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    aiCardTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    aiCardHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    aiTimestamp: {
      fontSize: 11,
      color: colors.textMuted,
    },
    refreshBtn: {
      padding: 2,
    },
    aiSummaryBody: {
      padding: 16,
    },
    aiSummaryText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    aiAnswerBody: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    aiAnswerText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
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
    aiInputDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    aiInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    aiInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
      paddingVertical: 4,
    },
    aiSendBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiSendBtnDisabled: {
      opacity: 0.4,
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
    weekNavRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    weekNavControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    weekNavBtn: {
      padding: 4,
    },
    weekNavBtnDisabled: {
      opacity: 0.3,
    },
    weekNavLabel: {
      fontSize: 12,
      color: colors.textMuted,
      minWidth: 100,
      textAlign: 'center',
    },
    viewAllText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
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
      fontWeight: '500',
      color: colors.textPrimary,
    },
    modalList: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  });
}
