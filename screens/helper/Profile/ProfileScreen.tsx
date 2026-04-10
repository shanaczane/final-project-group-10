import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './profilescreen.style';

export function HelperProfileScreen(): React.JSX.Element {
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'HE';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileStore}>{user?.store_name ?? 'My Store'}</Text>
        </View>
        <View style={styles.helperBadge}>
          <Text style={styles.helperBadgeText}>Helper</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
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
    </ScrollView>
  );
}
