import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from '@legendapp/state/react';
import { useTheme } from '../../../context/ThemeContext';
import {
  store$,
  loadAllData,
  addCategory,
  updateCategory,
  deleteCategory,
  recordRestock,
  updateProduct,
} from '../../../store';
import type { Category, Product } from '../../../types';
import { createStyles } from './categoriesscreen.style';

export const CategoriesScreen = observer(function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const categories = store$.categories.get();
  const products = store$.products.get();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [catModalVisible, setCatModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputName, setInputName] = useState('');
  const [saving, setSaving] = useState(false);

  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState('');
  const [restocking, setRestocking] = useState(false);

  useEffect(() => {
    if (categories.length === 0) loadAllData();
  }, []);

  function getCategoryProducts(catId: string): Product[] {
    return products.filter((p) => p.category_id === catId);
  }

  function getLowStock(prods: Product[]): Product[] {
    return prods.filter((p) => p.quantity <= p.min_threshold);
  }

  function stockStatus(p: Product): 'danger' | 'warning' | 'ok' {
    if (p.quantity <= p.min_threshold) return 'danger';
    if (p.quantity <= p.min_threshold * 1.5) return 'warning';
    return 'ok';
  }

  function openAdd(): void {
    setEditing(null);
    setInputName('');
    setCatModalVisible(true);
  }

  function openEdit(cat: Category): void {
    setEditing(cat);
    setInputName(cat.name);
    setCatModalVisible(true);
  }

  async function handleSave(): Promise<void> {
    const name = inputName.trim();
    if (!name) { Alert.alert('Error', 'Category name cannot be empty.'); return; }
    setSaving(true);
    const { error } = editing
      ? await updateCategory(editing.id, name)
      : await addCategory(name);
    setSaving(false);
    if (error) { Alert.alert('Error', error); return; }
    setCatModalVisible(false);
  }

  function confirmDelete(cat: Category): void {
    const count = getCategoryProducts(cat.id).length;
    const msg = count > 0
      ? `"${cat.name}" has ${count} product${count > 1 ? 's' : ''}. Deleting it will unassign those products. Continue?`
      : `Delete category "${cat.name}"?`;
    Alert.alert('Delete Category', msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await deleteCategory(cat.id);
          if (error) Alert.alert('Error', error);
          else if (selectedCategory?.id === cat.id) setSelectedCategory(null);
        },
      },
    ]);
  }

  async function handleRestock(): Promise<void> {
    if (!restockProduct) return;
    const qty = parseInt(restockQty, 10);
    if (!restockQty || isNaN(qty) || qty < 1) {
      Alert.alert('Error', 'Enter a valid quantity to add.');
      return;
    }
    setRestocking(true);
    const newQty = restockProduct.quantity + qty;
    await recordRestock(restockProduct.id, qty);
    await updateProduct(restockProduct.id, { quantity: newQty });
    setRestocking(false);
    setRestockProduct(null);
    setRestockQty('');
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selectedCategory) {
    const catProducts = getCategoryProducts(selectedCategory.id);
    const lowStock = getLowStock(catProducts);

    return (
      <View style={styles.container}>
        {/* Back header */}
        <View style={styles.detailHeader}>
          <Pressable style={styles.backBtn} onPress={() => setSelectedCategory(null)}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.detailHeaderActions}>
            <Pressable style={styles.iconBtn} onPress={() => openEdit(selectedCategory)}>
              <Ionicons name="pencil-outline" size={19} color={colors.textSecondary} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => confirmDelete(selectedCategory)}>
              <Ionicons name="trash-outline" size={19} color={colors.danger} />
            </Pressable>
          </View>
        </View>

        <View style={styles.detailTitleBlock}>
          <Text style={styles.detailSub}>Stay ahead of stockouts</Text>
          <Text style={styles.detailTitle}>{selectedCategory.name}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          {/* Hot banner */}
          {lowStock.length > 0 && (
            <View style={styles.hotBanner}>
              <View style={styles.hotIconWrap}>
                <Ionicons name="flame" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.hotCount}>{lowStock.length} item{lowStock.length !== 1 ? 's' : ''}</Text>
                <Text style={styles.hotSub}>need restocking soon</Text>
              </View>
            </View>
          )}

          {catProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>No products in this category.</Text>
            </View>
          ) : (
            catProducts.map((p) => {
              const status = stockStatus(p);
              const qtyColor = status === 'danger' ? colors.danger : status === 'warning' ? colors.warning : colors.success;
              const qtyBg = status === 'danger' ? colors.dangerBackground : status === 'warning' ? colors.warningBackground : colors.successBackground;
              return (
                <View key={p.id} style={styles.detailRow}>
                  <View style={[styles.detailQtyPill, { backgroundColor: qtyBg }]}>
                    <Text style={[styles.detailQtyText, { color: qtyColor }]}>{p.quantity}</Text>
                  </View>
                  <View style={styles.detailProductInfo}>
                    <Text style={styles.detailProductName}>{p.name}</Text>
                    <Text style={[styles.detailProductSub, { color: status === 'ok' ? colors.textMuted : colors.danger }]}>
                      {status === 'ok' ? `${p.quantity} in stock` : `Only ${p.quantity} left`}
                    </Text>
                  </View>
                  <Pressable style={styles.restockBtn} onPress={() => { setRestockProduct(p); setRestockQty(''); }}>
                    <Text style={styles.restockBtnText}>Restock</Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Restock modal */}
        <Modal visible={restockProduct !== null} transparent animationType="fade">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Restock</Text>
              <Text style={styles.modalSubtitle}>{restockProduct?.name}</Text>
              <Text style={styles.modalLabel}>Quantity to add</Text>
              <TextInput
                style={styles.modalInput}
                value={restockQty}
                onChangeText={(v) => setRestockQty(v.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 24"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                autoFocus
              />
              <View style={styles.modalActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setRestockProduct(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmBtn, restocking && styles.confirmBtnDisabled]}
                  onPress={handleRestock}
                  disabled={restocking}
                >
                  {restocking
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.confirmBtnText}>Add Stock</Text>}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Category rename/add modal */}
        <Modal visible={catModalVisible} transparent animationType="fade">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{editing ? 'Rename Category' : 'New Category'}</Text>
              <TextInput
                style={styles.modalInput}
                value={inputName}
                onChangeText={setInputName}
                placeholder="Category name"
                placeholderTextColor={colors.textMuted}
                autoFocus
                onSubmitEditing={handleSave}
              />
              <View style={styles.modalActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setCatModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.confirmBtnText}>Save</Text>}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }

  // ── Grid view ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>{categories.length} group{categories.length !== 1 ? 's' : ''}</Text>
          <Text style={styles.title}>Categories</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No categories yet. Tap Add to create one.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const count = getCategoryProducts(item.id).length;
          return (
            <Pressable style={styles.gridCard} onPress={() => setSelectedCategory(item)}>
              <View style={styles.gridCardIcon}>
                <Ionicons name="pricetag-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.gridCardName}>{item.name}</Text>
              <Text style={styles.gridCardCount}>{count} product{count !== 1 ? 's' : ''}</Text>
            </Pressable>
          );
        }}
      />

      {/* Add / Edit modal */}
      <Modal visible={catModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Rename Category' : 'New Category'}</Text>
            <TextInput
              style={styles.modalInput}
              value={inputName}
              onChangeText={setInputName}
              placeholder="Category name"
              placeholderTextColor={colors.textMuted}
              autoFocus
              onSubmitEditing={handleSave}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setCatModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.confirmBtnText}>Save</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});
