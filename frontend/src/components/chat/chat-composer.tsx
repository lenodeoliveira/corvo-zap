import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { theme } from '@/theme';

type ChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  sending?: boolean;
};

export function ChatComposer({ value, onChangeText, onSend, sending = false }: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !sending;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Anexar"
        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
        <Feather name="plus" size={22} color={theme.colors.black} />
      </Pressable>

      <TextInput
        multiline
        placeholder="Escreva sua carta..."
        placeholderTextColor={theme.colors.text.disabled}
        selectionColor={theme.colors.primary}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />

      <Pressable
        accessibilityLabel="Enviar mensagem"
        disabled={!canSend}
        onPress={onSend}
        style={({ pressed }) => [
          styles.actionButton,
          !canSend && styles.actionButtonDisabled,
          pressed && canSend && styles.actionButtonPressed,
        ]}>
        <Feather name="feather" size={20} color={theme.colors.black} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});
