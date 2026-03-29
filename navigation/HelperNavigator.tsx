import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { HelperDashboardScreen } from '../screens/helper/Dashboard/DashboardScreen';
import { HelperInventoryScreen } from '../screens/helper/Inventory/InventoryScreen';
import { HelperSalesScreen } from '../screens/helper/Sales/SalesScreen';

type HelperTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Sales: undefined;
};

const Tab = createBottomTabNavigator<HelperTabParamList>();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Dashboard: { focused: 'home', unfocused: 'home-outline' },
  Inventory: { focused: 'cube', unfocused: 'cube-outline' },
  Sales: { focused: 'cart', unfocused: 'cart-outline' },
};

export function HelperNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: 4,
          height: 60,
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
      <Tab.Screen name="Dashboard" component={HelperDashboardScreen} />
      <Tab.Screen name="Inventory" component={HelperInventoryScreen} />
      <Tab.Screen name="Sales" component={HelperSalesScreen} />
    </Tab.Navigator>
  );
}
