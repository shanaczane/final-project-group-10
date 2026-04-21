import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { store$, loadAllData, recordSale } from '../../../store';
import type { Product } from '../../../types';
import { createStyles } from './salesscreen.style';

export const SalesScreen = observer(function SalesScreen() {
  const { user, session } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const products = store$.products.get();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (products.length === 0) loadAllData();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  function selectProduct(product: Product): void {
    setSelected(product);
    setSearch('');
    setQuantity(1);
  }

  function clearSelection(): void {
    setSelected(null);
    setSearch('');
    setQuantity(1);
  }

  function increment(): void {
    if (!selected) return;
    if (quantity < selected.quantity) setQuantity((q) => q + 1);
  }

  function decrement(): void {
    if (quantity > 1) setQuantity((q) => q - 1);
  }

  async function handleConfirm(): Promise<void> {
    if (!selected) return;
    const recordedById = user?.id ?? session?.user?.id;
    if (!recordedById) { Alert.alert('Error', 'Not logged in.'); return; }
    if (quantity < 1) { Alert.alert('Error', 'Quantity must be at least 1.'); return; }
    if (quantity > selected.quantity) {
      Alert.alert('Error', `Only ${selected.quantity} units in stock.`);
      return;
    }
    Alert.alert(
      'Confirm Sale',
      `Sell ${quantity} × ${selected.name} for ₱${(quantity * selected.sell_price).toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setSaving(true);
            const { error } = await recordSale(selected.id, quantity, recordedById);
            setSaving(false);
            if (error) { Alert.alert('Error', error); return; }
            Alert.alert('Sale Recorded', `${quantity} × ${selected.name} sold.`);
            clearSelection();
          },
        },
      ],
    );
  }

  const total = selected ? quantity * selected.sell_price : 0;
  const stockAfter = selected ? selected.quantity - quantity : 0;

  if (selected) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backBtn} onPress={clearSelection}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Record Sale</Text>

        <View style={styles.selectedHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.selectedName}>{selected.name}</Text>
            <Text style={styles.selectedMeta}>{selected.category?.name ?? 'Uncategorized'}</Text>
          </View>
          <Pressable style={styles.changeBtn} onPress={clearSelection}>
            <Text style={styles.changeBtnText}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Stock</Text>
            <Text style={[styles.infoValue, selected.quantity <= selected.min_threshold && styles.infoValueDanger]}>
              {selected.quantity} units
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sell Price</Text>
            <Text style={styles.infoValue}>₱{selected.sell_price.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{selected.category?.name ?? 'Uncategorized'}</Text>
          </View>
        </View>

        <Text style={styles.label}>Quantity</Text>
        <View style={styles.stepper}>
          <Pressable
            style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]}
            onPress={decrement}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={22} color={quantity <= 1 ? colors.textMuted : colors.textPrimary} />
          </Pressable>
          <Text style={styles.stepValue}>{quantity}</Text>
          <Pressable
            style={[styles.stepBtn, quantity >= selected.quantity && styles.stepBtnDisabled]}
            onPress={increment}
            disabled={quantity >= selected.quantity}
          >
            <Ionicons name="add" size={22} color={quantity >= selected.quantity ? colors.textMuted : colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryTotal}>₱{total.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <Text style={styles.summaryLabel}>Stock After Sale</Text>
            <Text style={[styles.summaryStock, stockAfter <= selected.min_threshold && styles.summaryStockLow]}>
              {stockAfter} units
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Confirm Sale</Text>}
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Record Sale</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search product…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={filteredProducts.length === 0 ? { flex: 1 } : styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {products.length === 0
                ? 'No products available. Add products in Inventory first.'
                : 'No products match your search.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.productRow} onPress={() => selectProduct(item)}>
            <View style={styles.productRowInfo}>
              <Text style={styles.productRowName}>{item.name}</Text>
              <Text style={styles.productRowMeta}>
                {item.category?.name ?? 'Uncategorized'} · {item.quantity} in stock
              </Text>
            </View>
            <Text style={styles.productRowPrice}>₱{item.sell_price.toFixed(2)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
});
