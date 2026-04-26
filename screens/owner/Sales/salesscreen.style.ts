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

    // List view header
    header: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 12,
    },
    headerSub: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
    },
    pageTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
      marginBottom: 14,
    },

    // Search bar
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 999,
      marginHorizontal: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      gap: 8,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },

    // Sold Today stat card
    statCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginHorizontal: 20,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginBottom: 14,
    },
    statCardLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
      letterSpacing: 0.6,
      marginBottom: 4,
    },
    statCardValue: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    statCardRight: {
      alignItems: 'flex-end',
    },
    statCardUnits: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: -0.5,
    },

    // Product list
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      gap: 8,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    productRowInfo: {
      flex: 1,
    },
    productRowName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    productRowMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    productRowPrice: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.primary,
    },

    // Detail / confirm view
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
    selectedHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      gap: 12,
    },
    selectedName: {
      fontSize: 16,
      fontWeight: '600',
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
      borderRadius: 14,
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
      borderRadius: 14,
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
      fontWeight: '700',
      color: colors.textPrimary,
      minWidth: 48,
      textAlign: 'center',
    },
    summaryCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
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
      fontWeight: '700',
      color: colors.primary,
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
      borderRadius: 14,
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
      fontWeight: '600',
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
