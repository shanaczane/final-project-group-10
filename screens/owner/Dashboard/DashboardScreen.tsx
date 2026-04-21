import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';
import {
  store$,
  loadAllData,
  getLowStockItems,
  getTotalInventoryValue,
  getSalesToday,
  getWeeklySales,
  getWeekLabel,
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

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);

  const [weekOffset, setWeekOffset] = useState(0);
  const [activityVisible, setActivityVisible] = useState(false);

  useEffect(() => {
    loadAllData();
    fetchAiSummary();
  }, []);

  async function fetchAiSummary(): Promise<void> {
    setAiSummaryLoading(true);
    setAiSummaryError(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-summary');
      if (error || !data?.summary) {
        setAiSummaryError(data?.error ?? error?.message ?? 'Could not load summary.');
      } else {
        setAiSummary(data.summary);
      }
    } catch (e) {
      setAiSummaryError(e instanceof Error ? e.message : 'Could not load summary.');
    } finally {
      setAiSummaryLoading(false);
    }
  }

  async function handleAskQuery(): Promise<void> {
    if (!query.trim()) return;
    setQueryLoading(true);
    setQueryError(false);
    setQueryAnswer(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-query', {
        body: { question: query.trim() },
      });
      if (error || !data?.answer) {
        setQueryError(true);
      } else {
        setQueryAnswer(data.answer);
        setQuery('');
      }
    } catch {
      setQueryError(true);
    } finally {
      setQueryLoading(false);
    }
  }

  const lowStockItems = getLowStockItems(products);
  const totalValue = getTotalInventoryValue(products);
  const salesToday = getSalesToday(movements);
  const weeklySales = getWeeklySales(movements, weekOffset);
  const weekLabel = getWeekLabel(weekOffset);
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

      {/* AI Unified Card */}
      <View style={styles.aiSection}>
        {/* Card header */}
        <View style={styles.aiCardHeader}>
          <View style={styles.aiCardTitleRow}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.aiCardTitle}>AI Weekly Summary</Text>
          </View>
          <View style={styles.aiCardHeaderRight}>
            {aiSummary && !aiSummaryLoading && (
              <Text style={styles.aiTimestamp}>updated just now</Text>
            )}
            <Pressable onPress={fetchAiSummary} disabled={aiSummaryLoading} style={styles.refreshBtn}>
              {aiSummaryLoading
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <Ionicons name="refresh-outline" size={15} color={colors.primary} />}
            </Pressable>
          </View>
        </View>

        {/* Summary body */}
        <View style={styles.aiSummaryBody}>
          {aiSummaryLoading && !aiSummary ? (
            <View style={styles.aiLoadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.aiLoadingText}>Generating summary…</Text>
            </View>
          ) : aiSummaryError ? (
            <View style={styles.aiErrorRow}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.danger} />
              <Text style={[styles.aiErrorText, { flex: 1 }]}>{aiSummaryError}</Text>
              <Pressable onPress={fetchAiSummary} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : aiSummary ? (
            <Text style={styles.aiSummaryText}>{aiSummary}</Text>
          ) : null}
        </View>

        {/* Answer */}
        {(queryAnswer || queryError) && (
          <View style={styles.aiAnswerBody}>
            {queryError
              ? <Text style={styles.aiErrorText}>Could not get an answer. Try again.</Text>
              : <Text style={styles.aiAnswerText}>{queryAnswer}</Text>}
          </View>
        )}

        {/* Ask input */}
        <View style={styles.aiInputDivider} />
        <View style={styles.aiInputRow}>
          <TextInput
            style={styles.aiInput}
            placeholder="Ask a follow-up…"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleAskQuery}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.aiSendBtn, (!query.trim() || queryLoading) && styles.aiSendBtnDisabled]}
            onPress={handleAskQuery}
            disabled={!query.trim() || queryLoading}
          >
            {queryLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="send" size={14} color="#fff" />}
          </Pressable>
        </View>
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

      {/* Weekly sales table */}
      <View style={styles.section}>
        <View style={styles.weekNavRow}>
          <Text style={styles.sectionTitle}>Weekly Sales</Text>
          <View style={styles.weekNavControls}>
            <Pressable style={styles.weekNavBtn} onPress={() => setWeekOffset((w) => w + 1)}>
              <Ionicons name="chevron-back" size={16} color={colors.textPrimary} />
            </Pressable>
            <Text style={styles.weekNavLabel}>{weekLabel}</Text>
            <Pressable
              style={[styles.weekNavBtn, weekOffset === 0 && styles.weekNavBtnDisabled]}
              onPress={() => setWeekOffset((w) => Math.max(0, w - 1))}
              disabled={weekOffset === 0}
            >
              <Ionicons name="chevron-forward" size={16} color={weekOffset === 0 ? colors.textMuted : colors.textPrimary} />
            </Pressable>
          </View>
        </View>
        <View style={styles.weeklyTable}>
          <View style={styles.weeklyHeader}>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText]}>Day</Text>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText, styles.weeklyRight]}>Units</Text>
            <Text style={[styles.weeklyCell, styles.weeklyHeadText, styles.weeklyRight]}>Amount</Text>
          </View>
          {weeklySales.map((row, i) => (
            <View key={i} style={[styles.weeklyRow, i % 2 === 0 && styles.weeklyRowAlt]}>
              <Text style={styles.weeklyCell}>{row.day}</Text>
              <Text style={[styles.weeklyCell, styles.weeklyRight]}>{row.qty > 0 ? row.qty : '—'}</Text>
              <Text style={[styles.weeklyCell, styles.weeklyRight, row.amount > 0 && styles.weeklyAmount]}>
                {row.amount > 0
                  ? `₱${row.amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '—'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent activity */}
      <View style={styles.section}>
        <View style={styles.weekNavRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
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
