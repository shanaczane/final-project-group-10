import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { HelperDashboardScreen } from '../screens/helper/Dashboard/DashboardScreen';
import { HelperInventoryScreen } from '../screens/helper/Inventory/InventoryScreen';
import { HelperSalesScreen } from '../screens/helper/Sales/SalesScreen';
import { HelperProfileScreen } from '../screens/helper/Profile/ProfileScreen';

type HelperTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Sales: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HelperTabParamList>();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Dashboard: { focused: 'home', unfocused: 'home-outline' },
  Inventory: { focused: 'cube', unfocused: 'cube-outline' },
  Sales: { focused: 'cart', unfocused: 'cart-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export function HelperNavigator() {
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
      <Tab.Screen name="Dashboard" component={HelperDashboardScreen} />
      <Tab.Screen name="Inventory" component={HelperInventoryScreen} />
      <Tab.Screen name="Sales" component={HelperSalesScreen} />
      <Tab.Screen name="Profile" component={HelperProfileScreen} />
    </Tab.Navigator>
  );
}
