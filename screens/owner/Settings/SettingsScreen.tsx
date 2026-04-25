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

  const [viewHelper, setViewHelper] = useState<AppUser | null>(null);
  const [showViewPwd, setShowViewPwd] = useState(false);

  const [displayStoreName, setDisplayStoreName] = useState(user?.store_name ?? '');
  const [displayEmail, setDisplayEmail] = useState(user?.email ?? '');
  const [editField, setEditField] = useState<'store_name' | 'email' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHelpers(); }, []);

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
    if (!email || !password) { Alert.alert('Error', 'Email and password are required.'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters.'); return; }

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
        helper_id: newUserId,
        helper_email: email,
        p_owner_id: user!.id,
      });
      if (rpcErr) { setCreatingHelper(false); Alert.alert('Error', rpcErr.message); return; }
      await supabase.rpc('store_helper_password', { helper_id: newUserId, pwd: password });
      setCreatingHelper(false);
      setAddModalVisible(false);
      setHelperEmail('');
      setHelperPassword('');
      Alert.alert('Helper Added', `${email} has been added. You can view their password by tapping their name in the list.`);
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
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            await supabase.from('users').delete().eq('id', helper.id);
            setHelpers((prev) => prev.filter((h) => h.id !== helper.id));
          },
        },
      ],
    );
  }

  const initials = (user?.email ?? 'OW').slice(0, 2).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{displayStoreName || 'My Store'}</Text>
        <Text style={styles.profileEmail}>{displayEmail}</Text>
        <View style={styles.ownerBadge}>
          <Text style={styles.ownerBadgeText}>Owner</Text>
        </View>
      </View>

      {/* Account section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.listCard}>
        <Pressable style={styles.listRow} onPress={() => openEdit('store_name')}>
          <View style={styles.listIconWrap}>
            <Ionicons name="storefront-outline" size={17} color={colors.primary} />
          </View>
          <Text style={styles.listLabel}>Store Name</Text>
          <View style={styles.listRight}>
            <Text style={styles.listValue} numberOfLines={1}>{displayStoreName || '—'}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        </Pressable>

        <View style={styles.listDivider} />

        <Pressable style={styles.listRow} onPress={() => openEdit('email')}>
          <View style={styles.listIconWrap}>
            <Ionicons name="mail-outline" size={17} color={colors.primary} />
          </View>
          <Text style={styles.listLabel}>Email</Text>
          <View style={styles.listRight}>
            <Text style={styles.listValue} numberOfLines={1}>{displayEmail || '—'}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        </Pressable>

        <View style={styles.listDivider} />

        <View style={styles.listRow}>
          <View style={styles.listIconWrap}>
            <Ionicons name="moon-outline" size={17} color={colors.primary} />
          </View>
          <Text style={styles.listLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Helper Accounts section */}
      <Text style={styles.sectionTitle}>Helper Accounts</Text>
      <View style={styles.listCard}>
        {loadingHelpers ? (
          <View style={styles.listRow}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : helpers.length === 0 ? (
          <View style={styles.listRow}>
            <View style={styles.listIconWrap}>
              <Ionicons name="people-outline" size={17} color={colors.textMuted} />
            </View>
            <Text style={[styles.listLabel, { color: colors.textMuted }]}>No helpers yet</Text>
          </View>
        ) : (
          helpers.map((h, i) => (
            <React.Fragment key={h.id}>
              {i > 0 && <View style={styles.listDivider} />}
              <Pressable style={styles.listRow} onPress={() => { setViewHelper(h); setShowViewPwd(false); }}>
                <View style={styles.listIconWrap}>
                  <Ionicons name="person-outline" size={17} color={colors.textSecondary} />
                </View>
                <Text style={styles.listLabel} numberOfLines={1}>{h.email}</Text>
                <Pressable onPress={(e) => { e.stopPropagation(); confirmRemoveHelper(h); }} style={styles.removeBtn}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
                </Pressable>
              </Pressable>
            </React.Fragment>
          ))
        )}

        {helpers.length > 0 && <View style={styles.listDivider} />}

        <Pressable style={styles.listRow} onPress={() => setAddModalVisible(true)}>
          <View style={styles.listIconWrap}>
            <Ionicons name="person-add-outline" size={17} color={colors.primary} />
          </View>
          <Text style={[styles.listLabel, { color: colors.primary }]}>Add Helper</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Actions section */}
      <Text style={styles.sectionTitle}>Actions</Text>
      <View style={styles.listCard}>
        <Pressable style={styles.listRow} onPress={signOut}>
          <View style={styles.listIconWrap}>
            <Ionicons name="log-out-outline" size={17} color={colors.danger} />
          </View>
          <Text style={[styles.listLabel, { color: colors.danger }]}>Sign Out</Text>
        </Pressable>
      </View>

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
              <Pressable style={styles.cancelBtn} onPress={() => setEditField(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, saving && styles.confirmBtnDisabled]}
                onPress={handleSaveField}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmBtnText}>Save</Text>}
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
            <Text style={styles.modalSubtitle}>Create login credentials for your store assistant.</Text>

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
              <Pressable onPress={() => setShowHelperPwd((p) => !p)} style={styles.eyeBtn}>
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
                onPress={() => { setAddModalVisible(false); setHelperEmail(''); setHelperPassword(''); }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, creatingHelper && styles.confirmBtnDisabled]}
                onPress={handleCreateHelper}
                disabled={creatingHelper}
              >
                {creatingHelper
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.confirmBtnText}>Create</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* View Helper Password Modal */}
      <Modal visible={viewHelper !== null} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Helper Account</Text>
            <Text style={styles.modalSubtitle}>{viewHelper?.email}</Text>

            <Text style={styles.fieldLabel}>Saved Password</Text>
            <View style={styles.pwdWrapper}>
              <Text style={[styles.pwdInput, { paddingVertical: 12, color: colors.textPrimary }]}>
                {showViewPwd ? (viewHelper?.temp_password ?? '—') : '••••••••'}
              </Text>
              <Pressable onPress={() => setShowViewPwd((p) => !p)} style={styles.eyeBtn}>
                <Ionicons
                  name={showViewPwd ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setViewHelper(null)}>
                <Text style={styles.cancelBtnText}>Close</Text>
              </Pressable>
              <Pressable style={[styles.cancelBtn, { borderWidth: 1, borderColor: colors.danger }]} onPress={() => { setViewHelper(null); confirmRemoveHelper(viewHelper!); }}>
                <Text style={[styles.cancelBtnText, { color: colors.danger }]}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}
