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
    pageTitle: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: 24,
    },
    label: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.labelText,
      marginBottom: 8,
      marginTop: 20,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
    },
    searchBoxText: {
      flex: 1,
      fontSize: 15,
      color: colors.textPrimary,
    },
    searchBoxPlaceholder: {
      color: colors.textMuted,
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
      alignItems: 'center',
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    pickerContainer: {
      flex: 1,
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    pickerSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
    },
    pickerSearchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerRowInfo: {
      flex: 1,
    },
    pickerRowName: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    pickerRowMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    pickerRowPrice: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.success,
    },
    pickerEmpty: {
      textAlign: 'center',
      color: colors.textMuted,
      fontSize: 14,
      paddingTop: 40,
    },
  });
}
