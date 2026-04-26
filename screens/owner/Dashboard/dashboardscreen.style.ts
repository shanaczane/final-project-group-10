import { StyleSheet } from 'react-native';
import type { Colors } from '../../../context/ThemeContext';

export function createStyles(colors: Colors) {
  return StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 18, paddingTop: 56, paddingBottom: 32 },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingHorizontal: 4 },
    dateLabel: { fontSize: 12, color: colors.textMuted, fontFamily: 'Manrope_500Medium' },
    storeName: { fontSize: 22, fontFamily: 'Manrope_800ExtraBold', color: colors.textPrimary, letterSpacing: -0.5, marginTop: 2 },
    avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 14, fontFamily: 'Manrope_700Bold' },

    heroCard: { backgroundColor: colors.primary, borderRadius: 18, padding: 20, marginBottom: 10 },
    heroLabel: { fontSize: 11, fontFamily: 'Manrope_700Bold', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
    heroValue: { fontSize: 36, fontFamily: 'Manrope_800ExtraBold', color: '#fff', letterSpacing: -1, marginTop: 4 },
    heroSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.92)', fontFamily: 'Manrope_600SemiBold' },
    barRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 50, marginTop: 14 },
    barCol: { flex: 1, alignItems: 'center', gap: 4 },
    bar: { width: '100%', borderRadius: 2 },
    barLabel: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope_600SemiBold' },

    statRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    statCard: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16 },
    statLabel: { fontSize: 11, fontFamily: 'Manrope_600SemiBold', color: colors.textMuted, letterSpacing: 0.6 },
    statValue: { fontSize: 28, fontFamily: 'Manrope_800ExtraBold', color: colors.textPrimary, letterSpacing: -0.8, marginTop: 6 },
    statSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

    wideCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, marginBottom: 18 },
    wideValue: { fontSize: 22, fontFamily: 'Manrope_800ExtraBold', color: colors.textPrimary, letterSpacing: -0.5, marginTop: 4 },
    wideIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },

    section: { marginTop: 8, marginBottom: 14 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontFamily: 'Manrope_700Bold', color: colors.textPrimary },

    lowRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginBottom: 8 },
    qtyPill: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.dangerBackground, alignItems: 'center', justifyContent: 'center' },
    qtyPillText: { fontSize: 16, fontFamily: 'Manrope_800ExtraBold', color: colors.danger },
    lowName: { fontSize: 14, fontFamily: 'Manrope_700Bold', color: colors.textPrimary },
    lowSub: { fontSize: 11, color: colors.danger, fontFamily: 'Manrope_600SemiBold', marginTop: 2 },

    activityCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 4 },
    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12 },
    activityRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    activityIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    activityName: { fontSize: 13, fontFamily: 'Manrope_600SemiBold', color: colors.textPrimary },
    activityWhen: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
    activityQty: { fontSize: 14, fontFamily: 'Manrope_700Bold' },
    emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: 24 },
    seeAllText: { fontSize: 13, color: colors.primary, fontFamily: 'Manrope_600SemiBold' },

    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    modalTitle: { fontSize: 18, fontFamily: 'Manrope_700Bold', color: colors.textPrimary },
    modalList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  });
}
