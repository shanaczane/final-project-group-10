import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from './categoriesscreen.style';

export function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>Add, edit & delete categories — coming in Phase 2</Text>
    </View>
  );
}
