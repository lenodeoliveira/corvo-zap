import { useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/store/auth-store';
import { Spacing } from '@/theme';

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setSession = useAuthStore((state) => state.setSession);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const response = await usersService.getProfile();

      if (user && token) {
        setSession({
          token,
          user: {
            id: response.id,
            name: response.name,
            email: response.email,
            cityId: response.cityId,
          },
        });
      }

      return response;
    },
    enabled: Boolean(user?.id && token),
  });

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        void refetch();
      }
    }, [refetch, user?.id]),
  );

  const cityLabel = isLoading
    ? null
    : isError
      ? 'Não foi possível carregar o perfil'
      : (profile?.city?.name ?? '—');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Nome</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {profile?.name ?? user?.name ?? '—'}
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {profile?.email ?? user?.email ?? '—'}
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Cidade</Text>
        {cityLabel === null ? (
          <View style={styles.cityLoading}>
            <ActivityIndicator color={theme.primary} size="small" />
            <Text style={[styles.value, { color: theme.textSecondary, marginBottom: 0 }]}>
              Carregando...
            </Text>
          </View>
        ) : (
          <Text style={[styles.value, { color: theme.text }]}>{cityLabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    marginBottom: Spacing.sm,
  },
  cityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
});
