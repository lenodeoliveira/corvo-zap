import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Spacing } from '@/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const clearSession = useAuthStore((state) => state.clearSession);

  function handleLogout() {
    clearSession();
    router.replace('/(auth)/login');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable
        onPress={handleLogout}
        style={[styles.button, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={[styles.buttonText, { color: '#c0392b' }]}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
