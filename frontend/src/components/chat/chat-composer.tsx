import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '@/theme';

type ChatComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  sending?: boolean;
  availableCrows: number;
};

export function ChatComposer({
  value,
  onChangeText,
  onSend,
  sending = false,
  availableCrows,
}: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !sending && availableCrows > 0;

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

      <View style={styles.sendAction}>
        <Text style={styles.crowCount}>{availableCrows}</Text>
        <Pressable
          accessibilityLabel={`Enviar mensagem. ${availableCrows} corvos disponíveis`}
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
  sendAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  crowCount: {
    minWidth: 16,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
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
