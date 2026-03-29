import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './inventoryscreen.style';

export function HelperInventoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <Text style={styles.subtitle}>Browse products & search — coming in Phase 2</Text>
    </View>
  );
}
