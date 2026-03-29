import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './dashboardscreen.style';

export function HelperDashboardScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Metrics, alerts & reports — coming in Phase 3</Text>
    </View>
  );
}
