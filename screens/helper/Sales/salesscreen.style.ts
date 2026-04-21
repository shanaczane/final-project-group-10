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
    header: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 12,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
    },
    backBtnText: {
      fontSize: 15,
      color: colors.textPrimary,
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },
    listContent: {
      paddingBottom: 24,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    productRowInfo: {
      flex: 1,
    },
    productRowName: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    productRowMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    productRowPrice: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.success,
    },
    selectedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 14,
      gap: 12,
    },
    selectedName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    selectedMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    changeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    changeBtnText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.primary,
    },
    label: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.labelText,
      marginBottom: 8,
      marginTop: 20,
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginTop: 12,
      gap: 10,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 13,
      color: colors.textMuted,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    infoValueDanger: {
      color: colors.danger,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 8,
      gap: 24,
    },
    stepBtn: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepBtnDisabled: {
      opacity: 0.4,
    },
    stepValue: {
      fontSize: 28,
      fontWeight: '500',
      color: colors.textPrimary,
      minWidth: 48,
      textAlign: 'center',
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 16,
      overflow: 'hidden',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    summaryRowLast: {
      borderBottomWidth: 0,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryTotal: {
      fontSize: 20,
      fontWeight: '500',
      color: colors.success,
    },
    summaryStock: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    summaryStockLow: {
      color: colors.danger,
    },
    confirmBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    confirmBtnDisabled: {
      opacity: 0.6,
    },
    confirmBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
  });
}
