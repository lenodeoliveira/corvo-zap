import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { theme } from '@/theme';

type SocialAuthButtonProps = {
  provider: 'google' | 'apple';
  onPress?: () => void;
  style?: ViewStyle;
};

const providerConfig = {
  google: {
    label: 'Google',
    icon: 'google' as const,
    iconColor: theme.colors.white,
  },
  apple: {
    label: 'Apple',
    icon: 'apple' as const,
    iconColor: theme.colors.white,
  },
};

export function SocialAuthButton({ provider, onPress, style }: SocialAuthButtonProps) {
  const config = providerConfig[provider];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]}>
      <AntDesign name={config.icon} size={20} color={config.iconColor} />
      <Text style={styles.label}>{config.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: theme.button.height,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  buttonPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
});
