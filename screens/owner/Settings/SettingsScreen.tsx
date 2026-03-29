import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './settingsscreen.style';

export function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>

        <Text style={styles.label}>Store</Text>
        <Text style={styles.value}>{user?.store_name ?? 'Not set'}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user?.role ?? '—'}</Text>
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#E5E7EB', true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Text style={styles.comingSoon}>
        Helper account management — coming in Phase 3
      </Text>

      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}
