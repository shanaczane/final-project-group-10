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
      backgroundColor: colors.inputBackground,
      borderRadius: 999,
      marginHorizontal: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },
    searchDivider: {
      width: 1,
      height: 16,
      backgroundColor: colors.border,
    },
    chipsScroll: {
      marginTop: 12,
      height: 42,
      flexGrow: 0,
    },
    chipsContent: {
      paddingHorizontal: 20,
      gap: 8,
      alignItems: 'center',
    },
    filterChip: {
      paddingHorizontal: 18,
      height: 34,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 64,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 0,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
      fontFamily: 'Manrope_500Medium',
    },
    filterChipTextActive: {
      color: '#ffffff',
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      marginHorizontal: 20,
      marginBottom: 8,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 15,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textPrimary,
    },
    productMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
    productRight: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyBadge: {
      minWidth: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.successBackground,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    qtyBadgeDanger: {
      backgroundColor: colors.dangerBackground,
    },
    qtyBadgeWarning: {
      backgroundColor: colors.warningBackground,
    },
    qtyText: {
      fontSize: 15,
      fontFamily: 'Manrope_700Bold',
      color: colors.success,
    },
    qtyTextDanger: {
      color: colors.danger,
    },
    qtyTextWarning: {
      color: colors.warning,
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
    listContent: {
      paddingTop: 8,
      paddingBottom: 100,
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
      fontFamily: 'Manrope_500Medium',
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
      fontFamily: 'Manrope_500Medium',
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
      fontFamily: 'Manrope_500Medium',
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
      fontFamily: 'Manrope_500Medium',
    },
  });
}
