import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
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
} from '../../../store';
import { createStyles } from './dashboardscreen.style';

export const HelperDashboardScreen = observer(function HelperDashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loading = store$.loading.get();
  const products = store$.products.get();
  const movements = store$.stockMovements.get();

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState(false);

  const [query, setQuery] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  async function fetchAiSummary(): Promise<void> {
    setAiSummaryLoading(true);
    setAiSummaryError(false);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim();
      const token = sessionData.session?.access_token ?? anonKey;
      const { data, error } = await supabase.functions.invoke('ai-summary', {
        headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
      });
      if (error || !data?.summary) {
        setAiSummaryError(true);
      } else {
        setAiSummary(data.summary);
      }
    } catch {
      setAiSummaryError(true);
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
      const { data: sessionData } = await supabase.auth.getSession();
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim();
      const token = sessionData.session?.access_token ?? anonKey;
      const { data, error } = await supabase.functions.invoke('ai-query', {
        body: { question: query.trim() },
        headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
      });
      if (error || !data?.answer) {
        setQueryError(true);
      } else {
        setQueryAnswer(data.answer);
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
  const weeklySales = getWeeklySales(movements);
  const recentMovements = movements.slice(0, 10);

  const storeName = user?.store_name ?? 'My Store';

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
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.subtitle}>Good day, here's your summary</Text>
        </View>
        <View style={styles.helperBadge}>
          <Text style={styles.helperBadgeText}>Helper</Text>
        </View>
      </View>

      {/* Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Total Products</Text>
          <Text style={styles.metricValue}>{products.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Low Stock</Text>
          <Text style={[styles.metricValue, { color: lowStockItems.length > 0 ? colors.danger : colors.success }]}>
            {lowStockItems.length}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Inventory Value</Text>
          <Text style={styles.metricValue}>
            ₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Sales Today</Text>
          <Text style={styles.metricValue}>{salesToday}</Text>
          <Text style={styles.metricSub}>units sold</Text>
        </View>
      </View>

      {/* AI Weekly Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="sparkles" size={15} color={colors.primary} />
            <Text style={styles.sectionTitle}>AI Weekly Summary</Text>
          </View>
          <Pressable onPress={fetchAiSummary} disabled={aiSummaryLoading} style={styles.refreshBtn}>
            {aiSummaryLoading
              ? <ActivityIndicator size="small" color={colors.primary} />
              : <Ionicons name="refresh-outline" size={16} color={colors.primary} />}
          </Pressable>
        </View>
        <View style={styles.aiCard}>
          {aiSummaryLoading && !aiSummary ? (
            <View style={styles.aiLoadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.aiLoadingText}>Generating summary…</Text>
            </View>
          ) : aiSummaryError ? (
            <View style={styles.aiErrorRow}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
              <Text style={styles.aiErrorText}>Could not load summary.</Text>
              <Pressable onPress={fetchAiSummary} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : aiSummary ? (
            <>
              <Text style={styles.aiSummaryText}>{aiSummary}</Text>
              <Text style={styles.aiTimestamp}>Generated just now</Text>
            </>
          ) : null}
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

      {/* Weekly sales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Sales</Text>
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

      {/* Natural Language Query */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.primary} />
          <Text style={styles.sectionTitle}>Ask About Your Store</Text>
        </View>
        <View style={styles.queryInputRow}>
          <TextInput
            style={styles.queryInput}
            placeholder="e.g. Ilan ang nabenta ngayon?"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleAskQuery}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.askBtn, (!query.trim() || queryLoading) && styles.askBtnDisabled]}
            onPress={handleAskQuery}
            disabled={!query.trim() || queryLoading}
          >
            {queryLoading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.askBtnText}>Ask</Text>}
          </Pressable>
        </View>
        {queryAnswer && (
          <View style={styles.aiCard}>
            <Text style={styles.aiSummaryText}>{queryAnswer}</Text>
          </View>
        )}
        {queryError && (
          <View style={[styles.aiCard, styles.aiErrorCard]}>
            <Text style={styles.aiErrorText}>Could not get an answer. Try again.</Text>
          </View>
        )}
      </View>

      {/* Movement history */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentMovements.length === 0 ? (
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
    </ScrollView>
  );
});
