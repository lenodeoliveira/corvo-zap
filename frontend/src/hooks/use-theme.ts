import { theme } from '@/theme';

export function useTheme() {
  return {
    ...theme.colors,
    background: theme.colors.background,
    backgroundElement: theme.colors.surface,
    text: theme.colors.text.primary,
    textSecondary: theme.colors.text.secondary,
    primary: theme.colors.primary,
    border: theme.colors.border,
  };
}
