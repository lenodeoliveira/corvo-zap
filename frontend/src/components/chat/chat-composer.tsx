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
  const hasCrows = availableCrows > 0;
  const canSend = value.trim().length > 0 && !sending && hasCrows;

  return (
    <View style={styles.container}>
      <View style={styles.crowBadge}>
        <Feather
          name="feather"
          size={14}
          color={hasCrows ? theme.colors.primary : theme.colors.text.disabled}
        />
        <Text style={[styles.crowCount, !hasCrows && styles.crowCountEmpty]}>
          {availableCrows}
        </Text>
      </View>

      <TextInput
        multiline
        editable={hasCrows}
        placeholder={
          hasCrows ? 'Escreva sua carta...' : 'Sem corvos disponíveis no momento'
        }
        placeholderTextColor={theme.colors.text.disabled}
        selectionColor={theme.colors.primary}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />

      <Pressable
        accessibilityLabel={`Enviar carta. ${availableCrows} corvos disponíveis`}
        disabled={!canSend}
        onPress={onSend}
        style={({ pressed }) => [
          styles.sendButton,
          !canSend && styles.sendButtonDisabled,
          pressed && canSend && styles.sendButtonPressed,
        ]}>
        <Feather
          name="send"
          size={18}
          color={canSend ? theme.colors.black : theme.colors.text.disabled}
        />
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
    backgroundColor: 'rgba(18, 18, 18, 0.96)',
  },
  crowBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
  },
  crowCount: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
  },
  crowCountEmpty: {
    color: theme.colors.text.disabled,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    backgroundColor: theme.colors.primaryDark,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.surfaceLight,
  },
});
