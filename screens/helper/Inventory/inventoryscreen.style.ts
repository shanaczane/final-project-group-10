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
      fontFamily: 'Manrope_500Medium',
      color: colors.textPrimary,
    },
    productMeta: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
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
      fontFamily: 'Manrope_500Medium',
      color: colors.success,
    },
    qtyTextDanger: {
      color: colors.danger,
    },
    qtyTextWarning: {
      color: colors.warning,
    },
    productRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
  });
}
