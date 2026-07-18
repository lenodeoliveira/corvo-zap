import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

type MessageBubbleProps = {
  content: string;
  isOwn: boolean;
  time: string;
  isDelivered: boolean;
  isRead: boolean;
};

export function MessageBubble({
  content,
  isOwn,
  time,
  isDelivered,
  isRead,
}: MessageBubbleProps) {
  const receiptColor = isRead ? theme.colors.primary : theme.colors.black;

  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={styles.content}>{content}</Text>

        <View style={styles.meta}>
          <Text style={styles.time}>{time}</Text>
          {isOwn ? (
            <View style={styles.readReceipt}>
              <Feather name="check" size={12} color={receiptColor} />
              {isDelivered ? (
                <Feather
                  name="check"
                  size={12}
                  color={receiptColor}
                  style={styles.secondCheck}
                />
              ) : null}
            </View>
          ) : null}
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
    backgroundColor: theme.colors.secondary,
  },
  bubbleOwn: {
    borderBottomRightRadius: theme.spacing.xs,
  },
  bubbleOther: {
    borderBottomLeftRadius: theme.spacing.xs,
  },
  content: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
    color: theme.colors.black,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  time: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    color: 'rgba(0, 0, 0, 0.55)',
  },
  readReceipt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondCheck: {
    marginLeft: -6,
  },
});
