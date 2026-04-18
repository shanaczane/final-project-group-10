import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { DashboardScreen } from '../screens/owner/Dashboard/DashboardScreen';
import { InventoryScreen } from '../screens/owner/Inventory/InventoryScreen';
import { CategoriesScreen } from '../screens/owner/Categories/CategoriesScreen';
import { SalesScreen } from '../screens/owner/Sales/SalesScreen';
import { SettingsScreen } from '../screens/owner/Settings/SettingsScreen';

type OwnerTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Categories: undefined;
  Sales: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Dashboard: { focused: 'home', unfocused: 'home-outline' },
  Inventory: { focused: 'cube', unfocused: 'cube-outline' },
  Categories: { focused: 'grid', unfocused: 'grid-outline' },
  Sales: { focused: 'cart', unfocused: 'cart-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' },
};

export function OwnerNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: insets.bottom || 4,
          height: 60 + (insets.bottom || 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return (
            <Ionicons
              name={iconName as React.ComponentProps<typeof Ionicons>['name']}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Inventory" component={InventoryScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Sales" component={SalesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
