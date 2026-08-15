import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

type ChatsEmptyStateProps = {
  searching: boolean;
  onNewChat: () => void;
};

export function ChatsEmptyState({ searching, onNewChat }: ChatsEmptyStateProps) {
  if (searching) {
    return (
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Feather name="search" size={28} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>Nada por aqui</Text>
        <Text style={styles.text}>
          Nenhuma conversa ou pessoa encontrada para essa busca.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Feather name="feather" size={28} color={theme.colors.black} style={styles.icon} />
      </View>
      <Text style={styles.title}>Solte o primeiro corvo</Text>
      <Text style={styles.text}>
        Ainda não há correspondências. Encontre alguém e envie sua primeira carta.
      </Text>
      <Pressable
        onPress={onNewChat}
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
        <Feather name="plus" size={18} color={theme.colors.black} />
        <Text style={styles.ctaLabel}>Nova correspondência</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  icon: {
    transform: [{ rotate: '-20deg' }],
  },
  title: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    height: 48,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
  },
  ctaPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  ctaLabel: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.black,
  },
});
