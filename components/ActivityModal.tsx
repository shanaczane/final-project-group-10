import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SectionList,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import type { StockMovement } from '../types';

type FilterType = 'all' | 'sale' | 'restock' | 'adjustment';

interface Props {
  visible: boolean;
  movements: StockMovement[];
  onClose: () => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const monthDay = date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }).toUpperCase();
  if (date.toDateString() === today.toDateString()) return `TODAY · ${monthDay}`;
  if (date.toDateString() === yesterday.toDateString()) return `YESTERDAY · ${monthDay}`;
  return monthDay;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}

function peso(n: number): string {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ActivityModal({ visible, movements, onClose }: Props) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');

  const salesCount = movements.filter(m => m.movement_type === 'sale').length;
  const restockedQty = movements
    .filter(m => m.movement_type === 'restock')
    .reduce((s, m) => s + m.quantity_change, 0);
  const adjustmentCount = movements.filter(m => m.movement_type === 'adjustment').length;
  const totalRevenue = movements
    .filter(m => m.movement_type === 'sale')
    .reduce((s, m) => s + Math.abs(m.quantity_change) * (m.product?.sell_price ?? 0), 0);

  const filtered = useMemo(() => {
    if (filter === 'all') return movements;
    return movements.filter(m => m.movement_type === filter);
  }, [movements, filter]);

  const sections = useMemo(() => {
    const groups: Map<string, { label: string; revenue: number; data: StockMovement[] }> = new Map();
    for (const m of filtered) {
      const key = new Date(m.created_at).toDateString();
      if (!groups.has(key)) {
        groups.set(key, { label: formatDateLabel(m.created_at), revenue: 0, data: [] });
      }
      const group = groups.get(key)!;
      group.data.push(m);
      if (m.movement_type === 'sale') {
        group.revenue += Math.abs(m.quantity_change) * (m.product?.sell_price ?? 0);
      }
    }
    return Array.from(groups.values());
  }, [filtered]);

  const chips: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: movements.length },
    { key: 'sale', label: 'Sales', count: salesCount },
    { key: 'restock', label: 'Restocks', count: restockedQty },
    ...(adjustmentCount > 0 ? [{ key: 'adjustment' as FilterType, label: 'Edits', count: adjustmentCount }] : []),
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {/* Modal header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <Text style={{ fontSize: 18, fontFamily: 'Manrope_600SemiBold', color: colors.textPrimary }}>
            Activity
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          paddingVertical: 16,
          gap: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: colors.textMuted, letterSpacing: 0.6, marginBottom: 4 }}>
              REVENUE
            </Text>
            <Text style={{ fontSize: 18, fontFamily: 'Manrope_800ExtraBold', color: colors.textPrimary, letterSpacing: -0.3 }}>
              {peso(totalRevenue)}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: colors.textMuted, letterSpacing: 0.6, marginBottom: 4 }}>
              SALES
            </Text>
            <Text style={{ fontSize: 18, fontFamily: 'Manrope_800ExtraBold', color: colors.success, letterSpacing: -0.3 }}>
              {salesCount}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontFamily: 'Manrope_600SemiBold', color: colors.textMuted, letterSpacing: 0.6, marginBottom: 4 }}>
              RESTOCKED
            </Text>
            <Text style={{ fontSize: 18, fontFamily: 'Manrope_800ExtraBold', color: colors.success, letterSpacing: -0.3 }}>
              +{restockedQty}
            </Text>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' }}
          style={{ flexGrow: 0 }}
        >
          {chips.map(chip => {
            const active = filter === chip.key;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setFilter(chip.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 999,
                  backgroundColor: active ? colors.textPrimary : colors.surface,
                  borderWidth: 1,
                  borderColor: active ? colors.textPrimary : colors.border,
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'Manrope_500Medium',
                  color: active ? (colors.background) : colors.textSecondary,
                }}>
                  {chip.label}
                </Text>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'Manrope_600SemiBold',
                  color: active ? colors.background : colors.textMuted,
                }}>
                  {chip.count}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Date-grouped list */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: 'center',
              paddingVertical: 40,
            }}>
              No activity recorded yet.
            </Text>
          }
          renderSectionHeader={({ section }) => (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 18,
              paddingBottom: 8,
            }}>
              <Text style={{
                fontSize: 11,
                fontFamily: 'Manrope_600SemiBold',
                color: colors.textMuted,
                letterSpacing: 0.6,
              }}>
                {section.label}
              </Text>
              {section.revenue > 0 && (
                <Text style={{
                  fontSize: 13,
                  fontFamily: 'Manrope_600SemiBold',
                  color: colors.textSecondary,
                }}>
                  {peso(section.revenue)}
                </Text>
              )}
            </View>
          )}
          renderItem={({ item: m, index, section }) => {
            const isSale = m.movement_type === 'sale';
            const isRestock = m.movement_type === 'restock';
            const amount = isSale
              ? Math.abs(m.quantity_change) * (m.product?.sell_price ?? 0)
              : 0;
            const typeLabel = isSale ? 'SALE' : isRestock ? 'RESTOCK' : 'EDIT';
            const isLast = index === section.data.length - 1;

            return (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: isLast ? 0 : 6,
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                gap: 12,
              }}>
                {/* Icon */}
                <View style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: m.quantity_change < 0 ? colors.dangerBackground : colors.successBackground,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Ionicons
                    name={m.quantity_change < 0 ? 'arrow-down' : 'arrow-up'}
                    size={14}
                    color={m.quantity_change < 0 ? colors.danger : colors.success}
                  />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Manrope_600SemiBold',
                    color: colors.textPrimary,
                  }} numberOfLines={1}>
                    {m.product?.name ?? 'Unknown'}
                  </Text>
                  <Text style={{ fontSize: 11, color: isSale ? colors.danger : colors.success, marginTop: 1 }}>
                    <Text style={{ fontFamily: 'Manrope_600SemiBold' }}>{typeLabel}</Text>
                    {' · '}{formatTime(m.created_at)}
                  </Text>
                </View>

                {/* Qty + amount */}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontSize: 15,
                    fontFamily: 'Manrope_700Bold',
                    color: m.quantity_change < 0 ? colors.danger : colors.success,
                  }}>
                    {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                  </Text>
                  {amount > 0 && (
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>
                      {peso(amount)}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </Modal>
  );
}
