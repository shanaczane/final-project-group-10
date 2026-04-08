import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 56,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      gap: 4,
    },
    addBtnText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    categoryIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    categoryCount: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    rowActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionBtn: {
      padding: 6,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingTop: 80,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
    // Modal
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
      marginBottom: 16,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground,
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
      minWidth: 64,
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
