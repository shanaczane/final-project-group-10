import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 56,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      marginHorizontal: 20,
      paddingHorizontal: 12,
      paddingVertical: 7,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },
    chipsScroll: {
      marginTop: 12,
      maxHeight: 44,
      flexGrow: 0,
    },
    chipsContent: {
      paddingHorizontal: 20,
      gap: 8,
      alignItems: 'center',
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 56,
      alignItems: 'center',
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    filterChipTextActive: {
      color: '#ffffff',
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    statusDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    productMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    productRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    qtyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: colors.successBackground,
    },
    qtyBadgeDanger: {
      backgroundColor: colors.dangerBackground,
    },
    qtyBadgeWarning: {
      backgroundColor: colors.warningBackground,
    },
    qtyText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.success,
    },
    qtyTextDanger: {
      color: colors.danger,
    },
    qtyTextWarning: {
      color: colors.warning,
    },
    rowActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionBtn: {
      padding: 4,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    fab: {
      position: 'absolute',
      bottom: 28,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    // Modal styles
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
    modalClose: {
      padding: 4,
    },
    modalScroll: {
      flex: 1,
    },
    modalContent: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.labelText,
      marginBottom: 6,
      marginTop: 16,
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
    categoryChips: {
      marginTop: 4,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfField: {
      flex: 1,
    },
    thresholdHint: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 8,
      lineHeight: 18,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 28,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: '500',
    },
    // AI Fill styles
    aiFillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    aiFillBtnText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
    aiSuggestBox: {
      marginTop: 10,
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    aiSuggestTitle: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textMuted,
      marginBottom: 8,
    },
    aiSuggestRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8,
    },
    aiSuggestLabel: {
      fontSize: 13,
      color: colors.textMuted,
      width: 80,
    },
    aiSuggestValue: {
      fontSize: 13,
      color: colors.textPrimary,
      fontWeight: '500',
      flex: 1,
    },
    useBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    useBtnText: {
      fontSize: 12,
      color: '#ffffff',
      fontWeight: '500',
    },
    useBtnPlaceholder: {
      width: 38,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
      minWidth: 56,
      alignItems: 'center',
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    chipTextActive: {
      color: '#ffffff',
      fontWeight: '500',
    },
  });
}
