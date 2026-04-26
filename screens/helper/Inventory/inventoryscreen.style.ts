import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 56,
    },

    // Header
    header: {
      paddingHorizontal: 20,
      marginBottom: 14,
    },
    headerSub: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
    },
    pageTitle: {
      fontSize: 26,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },

    // Search bar
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      borderRadius: 999,
      marginHorizontal: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 8,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.textPrimary,
    },

    // Filter chips
    chipsScroll: {
      height: 42,
      flexGrow: 0,
      marginBottom: 8,
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

    // Product list
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 32,
      gap: 8,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 14,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    qtyBadge: {
      minWidth: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.successBackground,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
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
  });
}
