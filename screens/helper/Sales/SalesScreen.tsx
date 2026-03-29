import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './salesscreen.style';

export function HelperSalesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales</Text>
      <Text style={styles.subtitle}>Record sales & deduct stock — coming in Phase 3</Text>
    </View>
  );
}
