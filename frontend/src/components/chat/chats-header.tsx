import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

type ChatsHeaderProps = {
  onNewChat?: () => void;
};

export function ChatsHeader({ onNewChat }: ChatsHeaderProps) {
  return (
    <View style={styles.container}>
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

      <Text style={styles.title}>Chats</Text>

      <Pressable
        accessibilityLabel="Novo chat"
        onPress={onNewChat}
        style={({ pressed }) => [styles.newChatButton, pressed && styles.newChatButtonPressed]}>
        <Feather name="plus" size={22} color={theme.colors.black} />
      </Pressable>
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
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceLight,
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
  title: {
    flex: 1,
    marginLeft: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
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
});
