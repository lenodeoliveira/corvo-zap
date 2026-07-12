import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import type { User } from '@/types/api';
import { getInitials } from '@/utils/avatar';

type UserListItemProps = {
  user: User;
  loading?: boolean;
  onPress: () => void;
};

export function UserListItem({ user, loading = false, onPress }: UserListItemProps) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {user.name}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
          {user.email}
        </Text>
      </View>

      <View style={styles.meta}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : (
          <Feather name="message-circle" size={20} color={theme.colors.primary} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  containerPressed: {
    backgroundColor: theme.colors.surface,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  email: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  meta: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
