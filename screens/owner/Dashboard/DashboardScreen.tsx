import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
} from '../../../store';
import { SalesCalendar } from '../../../components/SalesCalendar';
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

  const [activityVisible, setActivityVisible] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const lowStockItems = getLowStockItems(products);
  const totalValue = getTotalInventoryValue(products);
  const salesToday = getSalesToday(movements);
  const recentMovements = movements.slice(0, 3);

  const greeting = user?.store_name ?? 'My Store';

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

      {/* Metric cards */}
      <View style={styles.metricsGrid}>
        <MetricCard label="Total Products" value={String(products.length)} styles={styles} colors={colors} />
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
        <MetricCard label="Sales Today" value={String(salesToday)} sub="units sold" styles={styles} colors={colors} />
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
              <Text style={styles.alertQty}>{p.quantity} left</Text>
            </View>
          ))}
        </View>
      )}

      {/* Sales calendar */}
      <View style={styles.sectionCard}>
        <SalesCalendar movements={movements} colors={colors} />
      </View>

      {/* Recent activity */}
      <View style={styles.sectionCard}>
        <View style={styles.weekNavRow}>
          <Text style={styles.rowTitle}>Recent Activity</Text>
          <Pressable onPress={() => setActivityVisible(true)}>
            <Text style={styles.viewAllText}>View all →</Text>
          </Pressable>
        </View>
        {movements.length === 0 ? (
          <Text style={styles.emptyText}>No activity recorded yet.</Text>
        ) : (
          recentMovements.map((m) => (
            <View key={m.id} style={styles.movementRow}>
              <View style={styles.movementLeft}>
                <Text style={styles.movementProduct}>{m.product?.name ?? 'Unknown'}</Text>
                <Text style={styles.movementDate}>
                  {new Date(m.created_at).toLocaleDateString('en-PH', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
              <Text style={[styles.movementQty, m.quantity_change < 0 ? styles.movementSale : styles.movementRestock]}>
                {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* All activity modal */}
      <Modal visible={activityVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Activity</Text>
            <Pressable onPress={() => setActivityVisible(false)}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>
          <FlatList
            data={movements}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalList}
            ListEmptyComponent={<Text style={styles.emptyText}>No activity recorded yet.</Text>}
            renderItem={({ item: m }) => (
              <View style={styles.movementRow}>
                <View style={styles.movementLeft}>
                  <Text style={styles.movementProduct}>{m.product?.name ?? 'Unknown'}</Text>
                  <Text style={styles.movementDate}>
                    {new Date(m.created_at).toLocaleDateString('en-PH', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Text style={[styles.movementQty, m.quantity_change < 0 ? styles.movementSale : styles.movementRestock]}>
                  {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                </Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
});
