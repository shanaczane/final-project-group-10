import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
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
} from '../../../store';
import type { Category, Product } from '../../../types';
import { createStyles } from './categoriesscreen.style';

export const CategoriesScreen = observer(function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const categories = store$.categories.get();
  const products = store$.products.get();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputName, setInputName] = useState('');
  const [saving, setSaving] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [productsVisible, setProductsVisible] = useState(false);

  useEffect(() => {
    if (categories.length === 0) loadAllData();
  }, []);

  function openAdd(): void {
    setEditing(null);
    setInputName('');
    setModalVisible(true);
  }

  function openEdit(cat: Category): void {
    setEditing(cat);
    setInputName(cat.name);
    setModalVisible(true);
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
    setModalVisible(false);
  }

  function confirmDelete(cat: Category): void {
    const count = products.filter((p) => p.category_id === cat.id).length;
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
        },
      },
    ]);
  }

  function getCategoryProducts(catId: string): Product[] {
    return products.filter((p) => p.category_id === catId);
  }

  function openProducts(cat: Category): void {
    setSelectedCategory(cat);
    setProductsVisible(true);
  }

  function stockStatus(p: Product): 'danger' | 'warning' | 'ok' {
    if (p.quantity <= p.min_threshold) return 'danger';
    if (p.quantity <= p.min_threshold * 1.5) return 'warning';
    return 'ok';
  }

  const catProducts = selectedCategory ? getCategoryProducts(selectedCategory.id) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Pressable style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No categories yet. Tap Add to create one.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const count = getCategoryProducts(item.id).length;
          return (
            <Pressable style={styles.categoryRow} onPress={() => openProducts(item)}>
              <View style={styles.categoryIcon}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryCount}>
                  {count} product{count !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <Pressable onPress={() => openEdit(item)} style={styles.actionBtn}>
                  <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
                </Pressable>
                <Pressable onPress={() => confirmDelete(item)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Products Panel */}
      <Modal
        visible={productsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProductsVisible(false)}
      >
        <Pressable
          style={styles.panelOverlay}
          onPress={() => setProductsVisible(false)}
        />
        <View style={styles.panelSheet}>
          <View style={styles.panelHandle} />
          <View style={styles.panelHeader}>
            <View style={styles.panelTitleRow}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
              <Text style={styles.panelTitle}>{selectedCategory?.name}</Text>
              <Text style={styles.panelCount}>
                {catProducts.length} item{catProducts.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <Pressable onPress={() => setProductsVisible(false)} style={styles.panelClose}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {catProducts.length === 0 ? (
            <View style={styles.panelEmpty}>
              <Ionicons name="cube-outline" size={40} color={colors.textMuted} />
              <Text style={styles.panelEmptyText}>No products in this category.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.panelList}>
              {catProducts.map((p) => {
                const status = stockStatus(p);
                const dotColor =
                  status === 'danger' ? colors.danger
                  : status === 'warning' ? colors.warning
                  : colors.success;
                const badgeBg =
                  status === 'danger' ? colors.dangerBackground
                  : status === 'warning' ? colors.warningBackground
                  : colors.successBackground;
                return (
                  <View key={p.id} style={styles.panelRow}>
                    <View style={[styles.panelDot, { backgroundColor: dotColor }]} />
                    <View style={styles.panelProductInfo}>
                      <Text style={styles.panelProductName}>{p.name}</Text>
                      <Text style={styles.panelProductPrice}>₱{p.sell_price.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.panelQtyBadge, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.panelQtyText, { color: dotColor }]}>
                        {p.quantity} left
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editing ? 'Rename Category' : 'New Category'}
            </Text>
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
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});
