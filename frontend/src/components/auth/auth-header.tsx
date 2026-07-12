import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

function SubtitleLine({ reversed = false }: { reversed?: boolean }) {
  return (
    <View style={[styles.lineContainer, reversed && styles.lineContainerReversed]}>
      {reversed ? <View style={styles.lineArrowReversed} /> : null}
      <View style={styles.line} />
      {!reversed ? <View style={styles.lineArrow} /> : null}
    </View>
  );
}

export function AuthHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Feather name="feather" size={28} color={theme.colors.primary} style={styles.logoIcon} />
        <Text style={styles.title}>CORVO-ZAP</Text>
      </View>

      <View style={styles.subtitleRow}>
        <SubtitleLine />
        <Text style={styles.subtitle}>MENSAGENS POR CORVOS</Text>
        <SubtitleLine reversed />
      </View>

      <Text style={styles.tagline}>Suas mensagens viajam mais longe. No tempo certo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  logoIcon: {
    transform: [{ rotate: '-25deg' }],
  },
  title: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    letterSpacing: 1.5,
  },
  lineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 72,
  },
  lineContainerReversed: {
    flexDirection: 'row-reverse',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  lineArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: theme.colors.border,
  },
  lineArrowReversed: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: theme.colors.border,
  },
  tagline: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
});
