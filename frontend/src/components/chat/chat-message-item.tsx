import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useLiveTracking } from '@/hooks/use-live-tracking';
import { theme } from '@/theme';
import type { Message } from '@/types/api';
import { formatMessageTime } from '@/utils/format-message';

import { MessageBubble } from './message-bubble';
import { TravelingCard } from './traveling-card';

type ChatMessageItemProps = {
  message: Message;
  currentUserId: string;
  onMessageDelivered?: (messageId: string) => void;
};

export function ChatMessageItem({
  message,
  currentUserId,
  onMessageDelivered,
}: ChatMessageItemProps) {
  const isOwn = message.senderId === currentUserId;
  const isServerDelivered = message.tracking.status === 'DELIVERED';

  const liveTracking = useLiveTracking({
    departureAt: message.departureAt,
    arrivalAt: message.tracking.arrivalAt,
    distanceKm: message.tracking.distanceKm,
    onDelivered: isOwn
      ? undefined
      : () => {
          onMessageDelivered?.(message.id);
        },
  });

  const isAwaitingContent = !isOwn && liveTracking.status === 'DELIVERED' && !isServerDelivered;
  const showIncomingTravelingCard = !isOwn && liveTracking.status === 'TRAVELING';
  const showBubble = isOwn || isServerDelivered;

  return (
    <View style={styles.container}>
      {showBubble ? (
        <MessageBubble
          content={message.content ?? ''}
          isOwn={isOwn}
          isDelivered={isServerDelivered}
          time={formatMessageTime(message.departureAt)}
        />
      ) : null}

      {showIncomingTravelingCard ? (
        <TravelingCard
          arrivalAt={message.tracking.arrivalAt}
          departureAt={message.departureAt}
          liveTracking={liveTracking}
        />
      ) : null}

      {isAwaitingContent ? (
        <View style={styles.awaitingContent}>
          <ActivityIndicator color={theme.colors.primary} size="small" />
          <Text style={styles.awaitingText}>Corvo chegou, abrindo mensagem...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  awaitingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  awaitingText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
