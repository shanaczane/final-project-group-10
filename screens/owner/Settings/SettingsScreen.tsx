import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';
import type { AppUser } from '../../../types';
import { createStyles } from './settingsscreen.style';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const [helpers, setHelpers] = useState<AppUser[]>([]);
  const [loadingHelpers, setLoadingHelpers] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [helperEmail, setHelperEmail] = useState('');
  const [helperPassword, setHelperPassword] = useState('');
  const [showHelperPwd, setShowHelperPwd] = useState(false);
  const [creatingHelper, setCreatingHelper] = useState(false);

  // Edit account fields
  const [displayStoreName, setDisplayStoreName] = useState(user?.store_name ?? '');
  const [displayEmail, setDisplayEmail] = useState(user?.email ?? '');
  const [editField, setEditField] = useState<'store_name' | 'email' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHelpers();
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayStoreName(user.store_name ?? '');
      setDisplayEmail(user.email ?? '');
    }
  }, [user]);

  function openEdit(field: 'store_name' | 'email'): void {
    setEditValue(field === 'store_name' ? displayStoreName : displayEmail);
    setEditField(field);
  }

  async function handleSaveField(): Promise<void> {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      if (editField === 'store_name') {
        const { error } = await supabase
          .from('users')
          .update({ store_name: editValue.trim() })
          .eq('id', user!.id);
        if (error) { Alert.alert('Error', error.message); return; }
        setDisplayStoreName(editValue.trim());
      } else {
        const { error } = await supabase.auth.updateUser({ email: editValue.trim() });
        if (error) { Alert.alert('Error', error.message); return; }
        setDisplayEmail(editValue.trim());
        Alert.alert('Check your email', 'A confirmation link was sent to the new address.');
      }
      setEditField(null);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function fetchHelpers(): Promise<void> {
    if (!user) return;
    setLoadingHelpers(true);
    const { data, error } = await supabase.rpc('get_my_helpers');
    if (error) console.warn('fetchHelpers error:', error.message);
    if (data) setHelpers(data as AppUser[]);
    setLoadingHelpers(false);
  }

  async function handleCreateHelper(): Promise<void> {
    const email = helperEmail.trim();
    const password = helperPassword;
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setCreatingHelper(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setCreatingHelper(false);
        Alert.alert('Error', result.msg ?? result.error_description ?? 'Failed to create account.');
        return;
      }

      const newUserId: string | undefined = result.user?.id ?? result.id;
      if (!newUserId) {
        setCreatingHelper(false);
        Alert.alert('Error', 'Could not get user ID from Supabase. Please try again.');
        return;
      }

      const { error: rpcErr } = await supabase.rpc('set_helper_role', {
        helper_id:    newUserId,
        helper_email: email,
        p_owner_id:   user!.id,
      });

      if (rpcErr) {
        setCreatingHelper(false);
        Alert.alert('Error', rpcErr.message);
        return;
      }

      setCreatingHelper(false);
      setAddModalVisible(false);
      setHelperEmail('');
      setHelperPassword('');
      Alert.alert(
        'Helper Added',
        `${email} has been added.\n\nMake sure to share the password with them — it cannot be retrieved later.`,
      );
      fetchHelpers();
    } catch {
      setCreatingHelper(false);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    }
  }

  function confirmRemoveHelper(helper: AppUser): void {
    Alert.alert(
      'Remove Helper',
      `Remove ${helper.email} as a helper? They will no longer be able to log in.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('users').delete().eq('id', helper.id);
            setHelpers((prev) => prev.filter((h) => h.id !== helper.id));
          },
        },
      ],
    );
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'OW';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Owner profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {displayStoreName || 'My Store'}
          </Text>
          <Text style={styles.profileEmail}>{displayEmail}</Text>
        </View>
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerBadgeText}>Owner</Text>
        </View>
      </View>

      {/* Helper accounts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Helper Accounts</Text>
          <Pressable style={styles.addHelperBtn} onPress={() => setAddModalVisible(true)}>
            <Ionicons name="person-add-outline" size={16} color={colors.primary} />
            <Text style={styles.addHelperBtnText}>Add</Text>
          </Pressable>
        </View>

        {loadingHelpers ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />
        ) : helpers.length === 0 ? (
          <Text style={styles.emptyHint}>No helpers yet. Tap Add to create one.</Text>
        ) : (
          helpers.map((h) => (
            <View key={h.id} style={styles.helperRow}>
              <View style={styles.helperAvatar}>
                <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
              </View>
              <Text style={styles.helperEmail}>{h.email}</Text>
              <Pressable
                onPress={() => confirmRemoveHelper(h)}
                style={styles.removeBtn}
              >
                <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* Account settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.settingsCard}>
          <Pressable style={styles.settingsRow} onPress={() => openEdit('store_name')}>
            <Text style={styles.settingsLabel}>Store Name</Text>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue} numberOfLines={1}>{displayStoreName || '—'}</Text>
              <Ionicons name="pencil-outline" size={14} color={colors.textMuted} />
            </View>
          </Pressable>

          <Pressable style={[styles.settingsRow, styles.settingsRowBorder]} onPress={() => openEdit('email')}>
            <Text style={styles.settingsLabel}>Email</Text>
            <View style={styles.settingsRowRight}>
              <Text style={styles.settingsValue} numberOfLines={1}>{displayEmail || '—'}</Text>
              <Ionicons name="pencil-outline" size={14} color={colors.textMuted} />
            </View>
          </Pressable>

          <View style={[styles.settingsRow, styles.settingsRowBorder]}>
            <Text style={styles.settingsLabel}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Sign out */}
      <Pressable style={styles.signOutBtn} onPress={signOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      {/* Edit field modal */}
      <Modal visible={editField !== null} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editField === 'store_name' ? 'Edit Store Name' : 'Edit Email'}
            </Text>
            <TextInput
              style={[styles.fieldInput, { marginTop: 12 }]}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={editField === 'store_name' ? 'Store name' : 'email@example.com'}
              placeholderTextColor={colors.textMuted}
              autoCapitalize={editField === 'email' ? 'none' : 'words'}
              keyboardType={editField === 'email' ? 'email-address' : 'default'}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setEditField(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
                onPress={handleSaveField}
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

      {/* Add Helper Modal */}
      <Modal visible={addModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Helper Account</Text>
            <Text style={styles.modalSubtitle}>
              Create login credentials for your store assistant.
            </Text>

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={helperEmail}
              onChangeText={setHelperEmail}
              placeholder="helper@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.fieldLabel}>Temporary Password</Text>
            <View style={styles.pwdWrapper}>
              <TextInput
                style={styles.pwdInput}
                value={helperPassword}
                onChangeText={setHelperPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showHelperPwd}
              />
              <Pressable
                onPress={() => setShowHelperPwd((p) => !p)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showHelperPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setAddModalVisible(false);
                  setHelperEmail('');
                  setHelperPassword('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, creatingHelper && styles.confirmBtnDisabled]}
                onPress={handleCreateHelper}
                disabled={creatingHelper}
              >
                {creatingHelper ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Create</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}
