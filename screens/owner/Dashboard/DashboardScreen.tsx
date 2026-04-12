import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { observer } from '@legendapp/state/react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  store$,
  loadAllData,
  getLowStockItems,
  getTotalInventoryValue,
  getSalesToday,
  getWeeklySales,
} from '../../../store';
import { createStyles } from './dashboardscreen.style';

function MetricCard({
  label,
  value,
  sub,
  accent,
  styles,
  colors,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof import('../../../context/ThemeContext').useTheme>['colors'];
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, accent ? { color: accent } : {}]}>
        {value}
      </Text>
      {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
    </View>
  );
}

export const DashboardScreen = observer(function DashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const tabBarHeight = useBottomTabBarHeight();

  const loading = store$.loading.get();
  const products = store$.products.get();
  const movements = store$.stockMovements.get();

  useEffect(() => {
    loadAllData();
  }, []);

  const lowStockItems = getLowStockItems(products);
  const totalValue = getTotalInventoryValue(products);
  const salesToday = getSalesToday(movements);
  const weeklySales = getWeeklySales(movements);
  const recentMovements = movements.slice(0, 10);

  const greeting = user?.store_name ? `${user.store_name}` : 'My Store';

  if (loading && products.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 16 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadAllData}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.storeName}>{greeting}</Text>
          <Text style={styles.subtitle}>Good day, here's your summary</Text>
        </View>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>Owner</Text>
        </View>
      </View>

      {/* Metric cards — 2×2 grid */}
      <View style={styles.metricsGrid}>
        <MetricCard
          label="Total Products"
          value={String(products.length)}
          styles={styles}
          colors={colors}
        />
        <MetricCard
          label="Low Stock"
          value={String(lowStockItems.length)}
          accent={lowStockItems.length > 0 ? colors.danger : colors.success}
          styles={styles}
          colors={colors}
        />
        <MetricCard
          label="Inventory Value"
          value={`₱${totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          styles={styles}
          colors={colors}
        />
        <MetricCard
          label="Sales Today"
          value={String(salesToday)}
          sub="units sold"
          styles={styles}
          colors={colors}
        />
      </View>

      {/* Low-stock alerts */}
      {lowStockItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Low Stock Alerts</Text>
          {lowStockItems.map((p) => (
            <View key={p.id} style={styles.alertRow}>
              <View style={styles.alertLeft}>
                <View style={styles.alertDot} />
                <Text style={styles.alertName}>{p.name}</Text>
              </View>
              <Text style={styles.alertQty}>
                {p.quantity} left
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Weekly sales table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Sales</Text>
        <View style={styles.weeklyTable}>
          <View style={styles.weeklyHeader}>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText]}>Day</Text>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText, styles.weeklyRight]}>Units</Text>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText, styles.weeklyRight]}>Amount</Text>
          </View>
          {weeklySales.map((row, i) => (
            <View
              key={i}
              style={[styles.weeklyRow, i % 2 === 0 && styles.weeklyRowAlt]}
            >
              <Text style={styles.weeklyCell}>{row.day}</Text>
              <Text style={[styles.weeklyCell, styles.weeklyRight]}>
                {row.qty > 0 ? row.qty : '—'}
              </Text>
              <Text style={[styles.weeklyCell, styles.weeklyRight, row.amount > 0 && styles.weeklyAmount]}>
                {row.amount > 0
                  ? `₱${row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stock movement history */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentMovements.length === 0 ? (
          <Text style={styles.emptyText}>No activity recorded yet.</Text>
        ) : (
          recentMovements.map((m) => (
            <View key={m.id} style={styles.movementRow}>
              <View style={styles.movementLeft}>
                <Text style={styles.movementProduct}>
                  {m.product?.name ?? 'Unknown'}
                </Text>
                <Text style={styles.movementDate}>
                  {new Date(m.created_at).toLocaleDateString('en-PH', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text
                style={[
                  styles.movementQty,
                  m.quantity_change < 0
                    ? styles.movementSale
                    : styles.movementRestock,
                ]}
              >
                {m.quantity_change > 0 ? '+' : ''}
                {m.quantity_change}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
});
