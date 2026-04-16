import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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

export const HelperSalesScreen = observer(function HelperSalesScreen() {
  const { user, session } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const products = store$.products.get();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (products.length === 0) loadAllData();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  function selectProduct(product: Product): void {
    setSelected(product);
    setSearch(product.name);
    setQuantity(1);
    setPickerVisible(false);
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
            setSelected(null);
            setSearch('');
            setQuantity(1);
          },
        },
      ],
    );
  }

  const total = selected ? quantity * selected.sell_price : 0;
  const stockAfter = selected ? selected.quantity - quantity : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>Record Sale</Text>

      <Text style={styles.label}>Select Product</Text>
      <Pressable style={styles.searchBox} onPress={() => setPickerVisible(true)}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <Text style={[styles.searchBoxText, !selected && styles.searchBoxPlaceholder]}>
          {selected ? selected.name : 'Search product…'}
        </Text>
        {selected && (
          <Pressable onPress={() => { setSelected(null); setSearch(''); }}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </Pressable>

      {selected && (
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
        </View>
      )}

      {selected && (
        <>
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
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm Sale</Text>
            )}
          </Pressable>
        </>
      )}

      {!selected && products.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No products available.</Text>
        </View>
      )}

      <Modal visible={pickerVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Product</Text>
            <Pressable onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>
          <View style={styles.pickerSearch}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.pickerSearchInput}
              placeholder="Search…"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.pickerEmpty}>No products found.</Text>}
            renderItem={({ item }) => (
              <Pressable style={styles.pickerRow} onPress={() => selectProduct(item)}>
                <View style={styles.pickerRowInfo}>
                  <Text style={styles.pickerRowName}>{item.name}</Text>
                  <Text style={styles.pickerRowMeta}>
                    {item.category?.name ?? 'Uncategorized'} · {item.quantity} in stock
                  </Text>
                </View>
                <Text style={styles.pickerRowPrice}>₱{item.sell_price.toFixed(2)}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </ScrollView>
  );
});
