import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import type { TrackingStatus } from '@/types/api';

type MessageBubbleProps = {
  content: string;
  isOwn: boolean;
  time: string;
  status: TrackingStatus;
  progress?: number;
};

function DeliveryStatus({
  status,
  progress = 0,
}: {
  status: TrackingStatus;
  progress?: number;
}) {
  if (status === 'TRAVELING') {
    return (
      <View style={styles.statusRow}>
        <Feather name="feather" size={12} color={theme.colors.primaryDark} />
        <Text style={styles.statusLabel}>A caminho · {Math.round(progress)}%</Text>
      </View>
    );
  }

  if (status === 'DELIVERED') {
    return (
      <View style={styles.statusRow}>
        <Feather name="mail" size={12} color={theme.colors.primaryDark} />
        <Text style={styles.statusLabel}>Entregue</Text>
      </View>
    );
  }

  return (
    <View style={styles.statusRow}>
      <Feather name="book-open" size={12} color={theme.colors.primary} />
      <Text style={[styles.statusLabel, styles.statusLabelRead]}>Lida</Text>
    </View>
  );
}

export function MessageBubble({
  content,
  isOwn,
  time,
  status,
  progress,
}: MessageBubbleProps) {
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.content, isOwn ? styles.contentOwn : styles.contentOther]}>
          {content}
        </Text>

        <View style={styles.meta}>
          <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>{time}</Text>
          {isOwn ? <DeliveryStatus progress={progress} status={status} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  rowOwn: {
    alignItems: 'flex-end',
  },
  rowOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  bubbleOwn: {
    backgroundColor: theme.colors.secondary,
    borderBottomRightRadius: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(184, 139, 66, 0.35)',
  },
  bubbleOther: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
  },
  contentOwn: {
    color: '#2A1F16',
  },
  contentOther: {
    color: theme.colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  time: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
  },
  timeOwn: {
    color: 'rgba(42, 31, 22, 0.55)',
  },
  timeOther: {
    color: theme.colors.text.disabled,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: 11,
    color: theme.colors.primaryDark,
  },
  statusLabelRead: {
    color: theme.colors.primary,
  },
});
