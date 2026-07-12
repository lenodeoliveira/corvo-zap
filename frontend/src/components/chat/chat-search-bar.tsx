import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, TextInput, View } from 'react-native';

import { theme } from '@/theme';

type ChatSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function ChatSearchBar({ value, onChangeText }: ChatSearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={theme.colors.text.disabled} />
      <TextInput
        placeholder="Buscar"
        placeholderTextColor={theme.colors.text.disabled}
        selectionColor={theme.colors.primary}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    height: theme.input.height,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
});
