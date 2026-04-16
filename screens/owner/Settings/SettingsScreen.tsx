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

  useEffect(() => {
    fetchHelpers();
  }, []);

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
      // Use fetch directly — avoids createClient AsyncStorage issues in React Native
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

      // When email confirmation is disabled, Supabase returns a session object
      // with the user nested under result.user.id instead of result.id
      const newUserId: string | undefined = result.user?.id ?? result.id;
      if (!newUserId) {
        setCreatingHelper(false);
        Alert.alert('Error', 'Could not get user ID from Supabase. Please try again.');
        return;
      }

      // Call SECURITY DEFINER RPC to set role=helper (bypasses RLS)
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
    } catch (err) {
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
            {user?.store_name ?? 'My Store'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
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
          <View style={styles.settingsRow}>
            <Text style={styles.settingsLabel}>Store Name</Text>
            <Text style={styles.settingsValue}>{user?.store_name ?? '—'}</Text>
          </View>

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
