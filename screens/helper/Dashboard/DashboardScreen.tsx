import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { store$, loadAllData, getWeeklySales } from '../../../store';
import { ActivityModal } from '../../../components/ActivityModal';
import { createStyles } from './dashboardscreen.style';

function formatActivityTime(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}


export const HelperDashboardScreen = observer(function HelperDashboardScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const loading = store$.loading.get();
  const products = store$.products.get();
  const movements = store$.stockMovements.get();

  const [activityVisible, setActivityVisible] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const weekly = getWeeklySales(movements);
  const todayRow = weekly[weekly.length - 1] ?? { qty: 0, amount: 0 };
  const recentMovements = movements.slice(0, 3);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'HL';

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
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadAllData} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.helloText}>Hello, Helper</Text>
        </View>
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarBadgeText}>{initials}</Text>
        </View>
      </View>

      {/* Sales Today */}
      <View style={styles.salesTodayCard}>
        <Text style={styles.salesTodayLabel}>SALES TODAY</Text>
        <Text style={styles.salesTodayAmount}>
          ₱{todayRow.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={styles.salesTodayUnits}>{todayRow.qty} units sold</Text>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionCard} onPress={() => navigation.navigate('Sales')}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="cart-outline" size={22} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>Record Sale</Text>
          <Text style={styles.actionSub}>Log a new sale</Text>
        </Pressable>
        <Pressable style={styles.actionCard} onPress={() => navigation.navigate('Inventory')}>
          <View style={styles.actionIconWrap}>
            <Ionicons name="cube-outline" size={22} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>View Stock</Text>
          <Text style={styles.actionSub}>Check inventory</Text>
        </Pressable>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityHeaderRow}>
        <Text style={styles.activityLabel}>RECENT ACTIVITY</Text>
        <Pressable onPress={() => setActivityVisible(true)}>
          <Text style={styles.viewAllText}>View all →</Text>
        </Pressable>
      </View>

      <View style={styles.activityCard}>
        {movements.length === 0 ? (
          <Text style={styles.emptyText}>No activity recorded yet.</Text>
        ) : (
          recentMovements.map((m, index) => (
            <View
              key={m.id}
              style={[
                styles.activityRow,
                index < recentMovements.length - 1 && styles.activityRowBorder,
              ]}
            >
              <View
                style={[
                  styles.activityIconWrap,
                  m.quantity_change < 0 ? styles.activityIconSale : styles.activityIconRestock,
                ]}
              >
                <Ionicons
                  name={m.quantity_change < 0 ? 'arrow-down' : 'arrow-up'}
                  size={13}
                  color={m.quantity_change < 0 ? colors.danger : colors.success}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityProduct}>{m.product?.name ?? 'Unknown'}</Text>
                <Text style={styles.activityTime}>{formatActivityTime(m.created_at)}</Text>
              </View>
              <Text
                style={[
                  styles.activityQty,
                  m.quantity_change < 0 ? styles.activityQtySale : styles.activityQtyRestock,
                ]}
              >
                {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
              </Text>
            </View>
          ))
        )}
      </View>

      <ActivityModal
        visible={activityVisible}
        movements={movements}
        onClose={() => setActivityVisible(false)}
      />
    </ScrollView>
  );
});
