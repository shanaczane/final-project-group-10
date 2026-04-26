import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';
import {
  store$,
  loadAllData,
  addProduct,
  updateProduct,
  deleteProduct,
  recordRestock,
} from '../../../store';
import type { Product } from '../../../types';
import { ProductDetailModal } from '../../shared/ProductDetailModal';
import { createStyles } from './inventoryscreen.style';

function stockStatus(product: Product): 'red' | 'amber' | 'green' {
  if (product.quantity <= product.min_threshold) return 'red';
  if (product.quantity <= product.min_threshold * 2) return 'amber';
  return 'green';
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

interface ProductFormProps {
  visible: boolean;
  editing: Product | null;
  onClose: () => void;
  colors: ReturnType<typeof import('../../../context/ThemeContext').useTheme>['colors'];
  styles: ReturnType<typeof createStyles>;
}

// Strip everything except digits (for whole-number fields)
function filterInteger(val: string): string {
  return val.replace(/[^0-9]/g, '');
}

// Strip everything except digits and one decimal point (for price fields)
function filterDecimal(val: string): string {
  const cleaned = val.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts[1];
  // Limit to 2 decimal places
  if (parts[1] !== undefined && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].slice(0, 2);
  }
  return cleaned;
}

function ProductFormModal({ visible, editing, onClose, colors, styles }: ProductFormProps) {
  const categories = store$.categories.get();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [minThreshold, setMinThreshold] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setCategoryId(editing.category_id ?? '');
      setQuantity(String(editing.quantity));
      setBuyPrice(String(editing.buy_price));
      setSellPrice(String(editing.sell_price));
      setMinThreshold(String(editing.min_threshold));
    } else {
      setName(''); setCategoryId(''); setQuantity('');
      setBuyPrice(''); setSellPrice(''); setMinThreshold('5');
    }
  }, [editing, visible]);

  async function handleSave(): Promise<void> {
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required.');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty < 0) {
      Alert.alert('Error', 'Quantity must be 0 or more.');
      return;
    }
    const min = parseInt(minThreshold, 10);
    if (!minThreshold || isNaN(min) || min < 1) {
      Alert.alert('Error', 'Min stock must be at least 1.');
      return;
    }
    const buy = parseFloat(buyPrice);
    if (!buyPrice || isNaN(buy) || buy < 0) {
      Alert.alert('Error', 'Buy price must be 0 or more.');
      return;
    }
    const sell = parseFloat(sellPrice);
    if (!sellPrice || isNaN(sell) || sell <= 0) {
      Alert.alert('Error', 'Sell price must be greater than 0.');
      return;
    }
    if (sell < buy) {
      Alert.alert('Error', 'Sell price cannot be lower than buy price.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId || null,
        quantity: qty,
        buy_price: buy,
        sell_price: sell,
        min_threshold: min,
      };
      const { error } = editing
        ? await updateProduct(editing.id, payload)
        : await addProduct(payload);
      if (error) {
        Alert.alert('Error', error);
        return;
      }
      if (editing && qty > editing.quantity) {
        await recordRestock(editing.id, qty - editing.quantity);
      }
      onClose();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</Text>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.fieldLabel}>Product Name</Text>
          <TextInput
            style={styles.fieldInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Coca-Cola 1.5L"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
            <Pressable
              style={[styles.chip, !categoryId && styles.chipActive]}
              onPress={() => setCategoryId('')}
            >
              <Text style={[styles.chipText, !categoryId && styles.chipTextActive]}>None</Text>
            </Pressable>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={[styles.chip, categoryId === c.id && styles.chipActive]}
                onPress={() => setCategoryId(c.id)}
              >
                <Text style={[styles.chipText, categoryId === c.id && styles.chipTextActive]}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <TextInput
                style={styles.fieldInput}
                value={quantity}
                onChangeText={(v) => setQuantity(filterInteger(v))}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Min Stock</Text>
              <TextInput
                style={styles.fieldInput}
                value={minThreshold}
                onChangeText={(v) => setMinThreshold(filterInteger(v))}
                placeholder="5"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Buy Price (₱)</Text>
              <TextInput
                style={styles.fieldInput}
                value={buyPrice}
                onChangeText={(v) => setBuyPrice(filterDecimal(v))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Sell Price (₱)</Text>
              <TextInput
                style={styles.fieldInput}
                value={sellPrice}
                onChangeText={(v) => setSellPrice(filterDecimal(v))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <Text style={styles.thresholdHint}>
            Min Stock: the app will alert you when quantity reaches this level.
          </Text>

          <Pressable
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Product</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Inventory Screen ─────────────────────────────────────────────────────────

export const InventoryScreen = observer(function InventoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loading = store$.loading.get();
  const products = store$.products.get();
  const categories = store$.categories.get();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    if (products.length === 0) loadAllData();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category_id === filterCat;
    return matchSearch && matchCat;
  });

  function openAdd(): void {
    setEditingProduct(null);
    setModalVisible(true);
  }

  function openDetail(product: Product): void {
    setDetailProduct(product);
    setDetailVisible(true);
  }

  function openEdit(product: Product): void {
    setEditingProduct(product);
    setModalVisible(true);
  }

  function confirmDelete(product: Product): void {
    Alert.alert(
      'Delete Product',
      `Delete "${product.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteProduct(product.id);
            if (error) Alert.alert('Error', error);
          },
        },
      ],
    );
  }

  const dotColor = (p: Product) => {
    const s = stockStatus(p);
    if (s === 'red') return colors.danger;
    if (s === 'amber') return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products…"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        <Pressable
          style={[styles.filterChip, filterCat === 'all' && styles.filterChipActive]}
          onPress={() => setFilterCat('all')}
        >
          <Text style={[styles.filterChipText, filterCat === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </Pressable>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.filterChip, filterCat === c.id && styles.filterChipActive]}
            onPress={() => setFilterCat(c.id)}
          >
            <Text style={[styles.filterChipText, filterCat === c.id && styles.filterChipTextActive]}>
              {c.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Product list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAllData} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {search || filterCat !== 'all' ? 'No products match your filter.' : 'No products yet. Tap + to add one.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.productRow} onPress={() => openDetail(item)}>
            <View style={[styles.statusDot, { backgroundColor: dotColor(item) }]} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>
                {item.category?.name ?? 'Uncategorized'} · ₱{item.sell_price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.productRight}>
              <View style={[
                styles.qtyBadge,
                stockStatus(item) === 'red' && styles.qtyBadgeDanger,
                stockStatus(item) === 'amber' && styles.qtyBadgeWarning,
              ]}>
                <Text style={[
                  styles.qtyText,
                  stockStatus(item) === 'red' && styles.qtyTextDanger,
                  stockStatus(item) === 'amber' && styles.qtyTextWarning,
                ]}>
                  {item.quantity}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </Pressable>
        )}
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <ProductFormModal
        visible={modalVisible}
        editing={editingProduct}
        onClose={() => setModalVisible(false)}
        colors={colors}
        styles={styles}
      />

      <ProductDetailModal
        product={detailProduct}
        visible={detailVisible}
        isOwner={true}
        onClose={() => setDetailVisible(false)}
        onEdit={(p) => { setDetailVisible(false); openEdit(p); }}
        onDelete={(p) => { setDetailVisible(false); confirmDelete(p); }}
      />
    </View>
  );
});
