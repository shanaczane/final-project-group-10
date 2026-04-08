import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
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
import type { Category } from '../../../types';
import { createStyles } from './categoriesscreen.style';

export const CategoriesScreen = observer(function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const categories = store$.categories.get();
  const products = store$.products.get();
  const loading = store$.loading.get();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputName, setInputName] = useState('');
  const [saving, setSaving] = useState(false);

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

  function productCount(catId: string): number {
    return products.filter((p) => p.category_id === catId).length;
  }

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
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            <View style={styles.categoryIcon}>
              <Ionicons name="pricetag-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryCount}>
                {productCount(item.id)} product{productCount(item.id) !== 1 ? 's' : ''}
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
          </View>
        )}
      />

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
