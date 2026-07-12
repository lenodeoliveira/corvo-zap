import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';
import { Spacing } from '@/theme';

export default function TestsScreen() {
  const theme = useTheme();
  const { user, token, clearSession } = useAuthStore();

  function handleLogout() {
    clearSession();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Tela de testes</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Login realizado com sucesso. Use esta tela para validar a integração com o backend.
        </Text>

        <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Usuário</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.name ?? '—'}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.email ?? '—'}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>ID</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.id ?? '—'}</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Token</Text>
          <Text style={[styles.token, { color: theme.text }]} numberOfLines={3}>
            {token ?? '—'}
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace('/(tabs)/chats')}
          style={[styles.button, { backgroundColor: theme.primary }]}>
          <Text style={[styles.buttonText, { color: theme.background }]}>Ir para o app</Text>
        </Pressable>

        <Pressable
          onPress={handleLogout}
          style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}>
          <Text style={[styles.buttonText, { color: '#c0392b' }]}>Sair</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
  value: {
    fontSize: 16,
  },
  token: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  button: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
