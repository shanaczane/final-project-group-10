import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StockMovement } from '../types';
import type { Colors } from '../context/ThemeContext';

const DAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildSalesMap(
  movements: StockMovement[],
): Record<string, { qty: number; amount: number }> {
  const map: Record<string, { qty: number; amount: number }> = {};
  for (const m of movements) {
    if (m.movement_type !== 'sale') continue;
    const key = toDateKey(new Date(m.created_at));
    if (!map[key]) map[key] = { qty: 0, amount: 0 };
    const units = Math.abs(m.quantity_change);
    map[key].qty += units;
    map[key].amount += units * (m.product?.sell_price ?? 0);
  }
  return map;
}

interface Props {
  movements: StockMovement[];
  colors: Colors;
}

export function SalesCalendar({ movements, colors }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const salesMap = buildSalesMap(movements);
  const todayKey = toDateKey(now);

  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });

  const isNextDisabled =
    year === now.getFullYear() && month === now.getMonth();

  function prevMonth(): void {
    setSelectedDate(null);
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }

  function nextMonth(): void {
    if (isNextDisabled) return;
    setSelectedDate(null);
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedInfo = selectedDate ? salesMap[selectedDate] : null;

  return (
    <View>
      {/* Header row: title left, month nav right */}
      <View style={styles.navRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sales Calendar</Text>
        <View style={styles.navControls}>
          <Pressable style={styles.navBtn} onPress={prevMonth}>
            <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
          </Pressable>
          <Text style={[styles.navLabel, { color: colors.textMuted }]}>{monthLabel}</Text>
          <Pressable
            style={[styles.navBtn, isNextDisabled && styles.navBtnDisabled]}
            onPress={nextMonth}
            disabled={isNextDisabled}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={isNextDisabled ? colors.textMuted : colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      {/* Day headers */}
      <View style={styles.row}>
        {DAY_HEADERS.map((d) => (
          <Text key={d} style={[styles.dayHeader, { color: colors.textMuted }]}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      {Array.from({ length: cells.length / 7 }, (_, row) => (
        <View key={row} style={styles.row}>
          {cells.slice(row * 7, row * 7 + 7).map((day, col) => {
            if (!day) return <View key={col} style={styles.cell} />;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasSales = !!salesMap[dateKey];
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;

            return (
              <Pressable
                key={col}
                style={styles.cell}
                onPress={() => setSelectedDate(isSelected ? null : dateKey)}
              >
                <View style={[
                  styles.dayCircle,
                  isToday && { backgroundColor: colors.primary },
                  isSelected && !isToday && { backgroundColor: colors.cardBackground, borderWidth: 1.5, borderColor: colors.primary },
                ]}>
                  <Text style={[
                    styles.dayNum,
                    { color: isToday ? '#fff' : colors.textPrimary },
                    isSelected && !isToday && { color: colors.primary, fontWeight: '600' },
                  ]}>
                    {day}
                  </Text>
                </View>
                {hasSales
                  ? <View style={[styles.dot, { backgroundColor: colors.success }]} />
                  : <View style={styles.dotPlaceholder} />}
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Selected day detail */}
      {selectedDate && (
        <View style={[styles.detail, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.detailDate, { color: colors.textMuted }]}>
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-PH', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </Text>
          {selectedInfo ? (
            <View style={styles.detailRow}>
              <Text style={[styles.detailUnits, { color: colors.textSecondary }]}>
                {selectedInfo.qty} unit{selectedInfo.qty !== 1 ? 's' : ''} sold
              </Text>
              <Text style={[styles.detailAmount, { color: colors.success }]}>
                ₱{selectedInfo.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          ) : (
            <Text style={[styles.detailEmpty, { color: colors.textMuted }]}>No sales this day.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: { padding: 4 },
  navBtnDisabled: { opacity: 0.3 },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  navLabel: { fontSize: 13, fontWeight: '500' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  dayHeader: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    paddingVertical: 6,
  },
  cell: {
    width: 36,
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 13,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 1,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
    marginTop: 1,
  },
  detail: {
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  detailDate: { fontSize: 12 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailUnits: { fontSize: 14 },
  detailAmount: { fontSize: 17, fontWeight: '600' },
  detailEmpty: { fontSize: 14 },
});
