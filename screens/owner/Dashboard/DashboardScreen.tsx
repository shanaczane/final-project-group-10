import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import {
  store$, loadAllData, getLowStockItems, getTotalInventoryValue, getWeeklySales,
} from '../../../store';
import { createStyles } from './dashboardscreen.style';

function peso(n: number): string {
  return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

  useEffect(() => { loadAllData(); }, []);

  const lowStockItems = getLowStockItems(products);
  const totalValue = getTotalInventoryValue(products);
  const weekly = getWeeklySales(movements);
  const recentMovements = movements.slice(0, 4);
  const todayRow = weekly[weekly.length - 1] ?? { qty: 0, amount: 0 };
  const maxAmount = Math.max(...weekly.map(d => d.amount), 1);

  const storeName = user?.store_name ?? 'My Store';
  const initials = storeName.split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const dateLabel = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'short', day: 'numeric' });

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
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadAllData} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.storeName}>{storeName}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>SALES TODAY</Text>
        <Text style={styles.heroValue}>{peso(todayRow.amount)}</Text>
        <View style={styles.heroSubRow}>
          <Ionicons name="trending-up" size={14} color="#fff" />
          <Text style={styles.heroSub}>{todayRow.qty} units sold</Text>
        </View>
        <View style={styles.barRow}>
          {weekly.map((d, i) => {
            const isToday = i === weekly.length - 1;
            const h = (d.amount / maxAmount) * 32 + 2;
            return (
              <View key={i} style={styles.barCol}>
                <View style={[styles.bar, { height: h, backgroundColor: isToday ? '#fff' : 'rgba(255,255,255,0.4)' }]} />
                <Text style={styles.barLabel}>{d.day[0]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PRODUCTS</Text>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statSub}>in catalog</Text>
        </View>
        <View style={[styles.statCard, lowStockItems.length > 0 && { borderColor: colors.danger, backgroundColor: colors.dangerBackground }]}>
          <Text style={[styles.statLabel, lowStockItems.length > 0 && { color: colors.danger }]}>LOW STOCK</Text>
          <Text style={[styles.statValue, { color: lowStockItems.length > 0 ? colors.danger : colors.success }]}>{lowStockItems.length}</Text>
          <Text style={[styles.statSub, lowStockItems.length > 0 && { color: colors.danger, opacity: 0.8 }]}>
            {lowStockItems.length > 0 ? 'need restock' : 'all good'}
          </Text>
        </View>
      </View>

      <View style={styles.wideCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.statLabel}>INVENTORY VALUE</Text>
          <Text style={styles.wideValue}>{peso(totalValue)}</Text>
        </View>
        <View style={styles.wideIcon}>
          <Ionicons name="storefront-outline" size={20} color={colors.primary} />
        </View>
      </View>

      {lowStockItems.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Low Stock</Text>
          </View>
          {lowStockItems.slice(0, 5).map((p) => (
            <View key={p.id} style={styles.lowRow}>
              <View style={styles.qtyPill}>
                <Text style={styles.qtyPillText}>{p.quantity}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lowName}>{p.name}</Text>
                <Text style={styles.lowSub}>Only {p.quantity} left</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable onPress={() => setActivityVisible(true)}>
            <Text style={styles.seeAllText}>See all →</Text>
          </Pressable>
        </View>
        <View style={styles.activityCard}>
          {recentMovements.length === 0 ? (
            <Text style={styles.emptyText}>No activity yet.</Text>
          ) : (
            recentMovements.map((m, i) => (
              <View key={m.id} style={[styles.activityRow, i < recentMovements.length - 1 && styles.activityRowBorder]}>
                <View style={[styles.activityIcon, { backgroundColor: m.quantity_change < 0 ? colors.dangerBackground : colors.successBackground }]}>
                  <Ionicons name={m.quantity_change < 0 ? 'arrow-down' : 'arrow-up'} size={13} color={m.quantity_change < 0 ? colors.danger : colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityName} numberOfLines={1}>{m.product?.name ?? 'Unknown'}</Text>
                  <Text style={styles.activityWhen}>
                    {new Date(m.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.activityQty, { color: m.quantity_change < 0 ? colors.danger : colors.success }]}>
                  {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

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
            renderItem={({ item: m, index: i }) => (
              <View style={[styles.activityRow, i < movements.length - 1 && styles.activityRowBorder]}>
                <View style={[styles.activityIcon, { backgroundColor: m.quantity_change < 0 ? colors.dangerBackground : colors.successBackground }]}>
                  <Ionicons name={m.quantity_change < 0 ? 'arrow-down' : 'arrow-up'} size={13} color={m.quantity_change < 0 ? colors.danger : colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityName} numberOfLines={1}>{m.product?.name ?? 'Unknown'}</Text>
                  <Text style={styles.activityWhen}>
                    {new Date(m.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.activityQty, { color: m.quantity_change < 0 ? colors.danger : colors.success }]}>
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
