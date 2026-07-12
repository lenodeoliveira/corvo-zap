import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { theme } from '@/theme';

type AuthInputProps = TextInputProps & {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
};

export function AuthInput({
  label,
  icon,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  style,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Feather name={icon} size={18} color={theme.colors.primary} style={styles.leadingIcon} />
        <TextInput
          placeholderTextColor={theme.colors.text.disabled}
          style={[styles.input, style]}
          secureTextEntry={showPasswordToggle && !isPasswordVisible}
          {...props}
        />
        {showPasswordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            onPress={onTogglePassword}
            style={styles.trailingIcon}>
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={18}
              color={theme.colors.primary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  label: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.input.height,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
  },
  leadingIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  trailingIcon: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
});
