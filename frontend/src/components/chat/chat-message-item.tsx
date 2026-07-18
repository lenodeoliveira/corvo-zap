import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

import { useLiveTracking } from '@/hooks/use-live-tracking';
import { realtimeService } from '@/services/realtime.service';
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
  const isServerRead = message.tracking.status === 'READ';
  const isServerDelivered =
    message.tracking.status === 'DELIVERED' || isServerRead;
  const hasMarkedReadRef = useRef(false);

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

  useEffect(() => {
    if (
      isOwn ||
      message.tracking.status !== 'DELIVERED' ||
      hasMarkedReadRef.current
    ) {
      return;
    }

    hasMarkedReadRef.current = true;

    void realtimeService.markMessageRead(message.id).then((response) => {
      if (!response?.ok) {
        hasMarkedReadRef.current = false;
      }
    });
  }, [isOwn, message.id, message.tracking.status]);

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
          isRead={isServerRead}
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
