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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';
import {
  store$,
  loadAllData,
  getLowStockItems,
  getTotalInventoryValue,
  getSalesToday,
} from '../../../store';
import { SalesCalendar } from '../../../components/SalesCalendar';
import { createStyles } from './dashboardscreen.style';

export const HelperDashboardScreen = observer(function HelperDashboardScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loading = store$.loading.get();
  const products = store$.products.get();
  const movements = store$.stockMovements.get();

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);
  const [aiSummaryAge, setAiSummaryAge] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState(false);

  const [activityVisible, setActivityVisible] = useState(false);

  const CACHE_KEY = 'ai_summary_cache';
  const CACHE_TTL = 30 * 60 * 1000;

  useEffect(() => {
    loadAllData();
    loadSummaryWithCache();
  }, []);

  async function loadSummaryWithCache(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const { text, timestamp } = JSON.parse(raw) as { text: string; timestamp: number };
        setAiSummary(text);
        setAiSummaryAge(formatAge(timestamp));
        if (Date.now() - timestamp < CACHE_TTL) return;
      }
    } catch {
      // cache unreadable, continue to fetch
    }
    fetchAiSummary();
  }

  function formatAge(timestamp: number): string {
    const mins = Math.floor((Date.now() - timestamp) / 60000);
    if (mins < 1) return 'updated just now';
    if (mins < 60) return `updated ${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `updated ${hrs}h ago`;
  }

  async function fetchAiSummary(): Promise<void> {
    setAiSummaryLoading(true);
    setAiSummaryError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim();
      const token = sessionData.session?.access_token ?? anonKey;
      const { data, error } = await supabase.functions.invoke('ai-summary', {
        headers: { Authorization: `Bearer ${token}`, apikey: anonKey },
      });
      if (error || !data?.summary) {
        if (!aiSummary) {
          setAiSummaryError(data?.error ?? error?.message ?? 'Could not load summary.');
        }
      } else {
        setAiSummary(data.summary);
        setAiSummaryAge('updated just now');
        setAiSummaryError(null);
        await AsyncStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ text: data.summary, timestamp: Date.now() }),
        );
      }
    } catch {
      if (!aiSummary) {
        setAiSummaryError('Could not load summary.');
      }
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
  const recentMovements = movements.slice(0, 3);

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
          <Text style={styles.storeName}>Dashboard</Text>
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

      {/* AI Unified Card */}
      <View style={styles.aiSection}>
        <View style={styles.aiCardHeader}>
          <View style={styles.aiCardTitleRow}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.aiCardTitle}>AI Weekly Summary</Text>
          </View>
          <View style={styles.aiCardHeaderRight}>
            {aiSummaryAge && !aiSummaryLoading && (
              <Text style={styles.aiTimestamp}>{aiSummaryAge}</Text>
            )}
            <Pressable onPress={fetchAiSummary} disabled={aiSummaryLoading} style={styles.refreshBtn}>
              {aiSummaryLoading
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <Ionicons name="refresh-outline" size={15} color={colors.primary} />}
            </Pressable>
          </View>
        </View>

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

        {(queryAnswer || queryError) && (
          <View style={styles.aiAnswerBody}>
            {queryError
              ? <Text style={styles.aiErrorText}>Could not get an answer. Try again.</Text>
              : <Text style={styles.aiAnswerText}>{queryAnswer}</Text>}
          </View>
        )}

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

      {/* Sales calendar */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Sales Calendar</Text>
        <SalesCalendar movements={movements} colors={colors} />
      </View>

      {/* Recent activity */}
      <View style={styles.sectionCard}>
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
