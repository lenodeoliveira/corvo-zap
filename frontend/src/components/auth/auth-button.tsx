import Feather from '@expo/vector-icons/Feather';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { theme } from '@/theme';

type AuthButtonProps = {
  label: string;
  loading?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function AuthButton({
  label,
  loading = false,
  icon,
  disabled,
  onPress,
  style,
}: AuthButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.colors.black} />
      ) : (
        <>
          {icon ? (
            <Feather name={icon} size={18} color={theme.colors.black} style={styles.icon} />
          ) : null}
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: theme.button.height,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  icon: {
    transform: [{ rotate: '-25deg' }],
  },
  label: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.black,
  },
});
