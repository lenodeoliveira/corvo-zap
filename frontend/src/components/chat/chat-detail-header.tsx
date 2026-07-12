import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import { getInitials } from '@/utils/avatar';

type ChatDetailHeaderProps = {
  participantName: string;
  onBack: () => void;
};

export function ChatDetailHeader({ participantName, onBack }: ChatDetailHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={onBack}
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
        <Feather name="chevron-left" size={24} color={theme.colors.text.primary} />
      </Pressable>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(participantName)}</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text numberOfLines={1} style={styles.name}>
            {participantName}
          </Text>
          <Text style={styles.status}>Online</Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Mais opções"
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
        <Feather name="more-vertical" size={20} color={theme.colors.text.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: theme.colors.surface,
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
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
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  status: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
});
