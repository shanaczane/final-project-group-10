import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
import { store$, loadAllData } from '../../../store';
import type { Product } from '../../../types';
import { ProductDetailModal } from '../../shared/ProductDetailModal';
import { createStyles } from './inventoryscreen.style';

function stockStatus(product: Product): 'red' | 'amber' | 'green' {
  if (product.quantity <= product.min_threshold) return 'red';
  if (product.quantity <= product.min_threshold * 2) return 'amber';
  return 'green';
}

export const HelperInventoryScreen = observer(function HelperInventoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const loading = store$.loading.get();
  const products = store$.products.get();
  const categories = store$.categories.get();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
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

  const dotColor = (p: Product) => {
    const s = stockStatus(p);
    if (s === 'red') return colors.danger;
    if (s === 'amber') return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      {/* Search */}
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

      {/* Product list — read-only */}
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
              {search || filterCat !== 'all' ? 'No products match your filter.' : 'No products available.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.productRow}
            onPress={() => { setDetailProduct(item); setDetailVisible(true); }}
          >
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

      <ProductDetailModal
        product={detailProduct}
        visible={detailVisible}
        isOwner={false}
        onClose={() => setDetailVisible(false)}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </View>
  );
});
