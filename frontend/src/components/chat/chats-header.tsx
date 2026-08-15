import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

type ChatsHeaderProps = {
  onNewChat?: () => void;
  searching?: boolean;
  onCancelSearch?: () => void;
};

export function ChatsHeader({
  onNewChat,
  searching = false,
  onCancelSearch,
}: ChatsHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Feather
            name="feather"
            size={18}
            color={theme.colors.black}
            style={styles.logoIcon}
          />
          <View style={styles.letter}>
            <Feather name="mail" size={8} color={theme.colors.error} />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Corvo-Zap</Text>
          <Text style={styles.subtitle}>Mensageria</Text>
        </View>
      </View>

      {searching ? (
        <Pressable
          accessibilityLabel="Cancelar busca"
          onPress={onCancelSearch}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryPressed]}>
          <Feather name="x" size={20} color={theme.colors.text.primary} />
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel="Nova correspondência"
          onPress={onNewChat}
          style={({ pressed }) => [styles.newChatButton, pressed && styles.newChatButtonPressed]}>
          <Feather name="plus" size={22} color={theme.colors.black} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingRight: theme.spacing.sm,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    transform: [{ rotate: '-25deg' }],
  },
  letter: {
    position: 'absolute',
    right: 6,
    bottom: 8,
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatButtonPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
});
