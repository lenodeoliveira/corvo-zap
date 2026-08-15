import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue } from 'react-native';

import { theme } from '@/theme';

type TabIconName = 'feather' | 'user' | 'settings';

function TabIcon({
  name,
  color,
  focused,
}: {
  name: TabIconName;
  color: ColorValue;
  focused: boolean;
}) {
  return <Feather name={name} size={focused ? 24 : 22} color={color as string} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.semiBold,
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.text.primary,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.disabled,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Corvos',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="feather" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="user" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} name="settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  tabBarLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: theme.spacing.xs,
  },
});
