import { Dimensions, StyleSheet } from 'react-native';

const CARD_WIDTH = (Dimensions.get('window').width - 32 - 12) / 2;
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 56,
    },

    // ── Grid header ───────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 18,
    },
    headerSub: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
    },
    title: {
      fontSize: 26,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 9,
      gap: 4,
    },
    addBtnText: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'Manrope_600SemiBold',
    },

    // ── Grid ─────────────────────────────────────────────────────────────────
    grid: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    gridRow: {
      gap: 12,
      marginBottom: 12,
    },
    gridCard: {
      width: CARD_WIDTH,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      minHeight: 110,
      justifyContent: 'flex-end',
    },
    gridCardIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    gridCardName: {
      fontSize: 15,
      fontFamily: 'Manrope_700Bold',
      color: colors.textPrimary,
    },
    gridCardCount: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 3,
    },

    // ── Detail header ─────────────────────────────────────────────────────────
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 4,
    },
    backBtn: {
      padding: 4,
    },
    detailHeaderActions: {
      flexDirection: 'row',
      gap: 4,
    },
    iconBtn: {
      padding: 8,
    },
    detailTitleBlock: {
      paddingHorizontal: 20,
      marginBottom: 18,
    },
    detailSub: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 2,
    },
    detailTitle: {
      fontSize: 26,
      fontFamily: 'Manrope_800ExtraBold',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },

    // ── Detail content ────────────────────────────────────────────────────────
    detailContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 10,
    },
    hotBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      gap: 14,
      marginBottom: 4,
    },
    hotIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hotCount: {
      fontSize: 17,
      fontFamily: 'Manrope_800ExtraBold',
      color: '#fff',
    },
    hotSub: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.85)',
      marginTop: 1,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      gap: 12,
    },
    detailQtyPill: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailQtyText: {
      fontSize: 16,
      fontFamily: 'Manrope_800ExtraBold',
    },
    detailProductInfo: {
      flex: 1,
    },
    detailProductName: {
      fontSize: 14,
      fontFamily: 'Manrope_600SemiBold',
      color: colors.textPrimary,
    },
    detailProductSub: {
      fontSize: 12,
      marginTop: 2,
      fontFamily: 'Manrope_500Medium',
    },
    restockBtn: {
      backgroundColor: colors.primary,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    restockBtnText: {
      fontSize: 13,
      fontFamily: 'Manrope_600SemiBold',
      color: '#fff',
    },

    // ── Empty ─────────────────────────────────────────────────────────────────
    emptyContainer: {
      alignItems: 'center',
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },

    // ── Modals ────────────────────────────────────────────────────────────────
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
      borderRadius: 18,
      padding: 24,
    },
    modalTitle: {
      fontSize: 17,
      fontFamily: 'Manrope_700Bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
    },
    modalLabel: {
      fontSize: 13,
      fontFamily: 'Manrope_500Medium',
      color: colors.labelText,
      marginBottom: 8,
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
      fontFamily: 'Manrope_500Medium',
    },
    confirmBtn: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.primary,
      minWidth: 80,
      alignItems: 'center',
    },
    confirmBtnDisabled: {
      opacity: 0.6,
    },
    confirmBtnText: {
      fontSize: 14,
      color: '#ffffff',
      fontFamily: 'Manrope_600SemiBold',
    },
  });
}
