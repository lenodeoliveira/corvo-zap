import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import { useLiveTracking } from '@/hooks/use-live-tracking';
import { realtimeService } from '@/services/realtime.service';
import { theme } from '@/theme';
import type { Message } from '@/types/api';
import { formatMessageTime } from '@/utils/format-message';

import { MessageBubble } from './message-bubble';
import { TravelingCard } from './traveling-card';

const OPENING_FADE_MS = 450;
const REVEAL_FADE_MS = 650;
const REVEAL_SLIDE_PX = 12;

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
  const wasServerDeliveredRef = useRef(isServerDelivered);

  const cardOpacity = useRef(new Animated.Value(1)).current;
  const openingOpacity = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(isOwn || isServerDelivered ? 1 : 0)).current;
  const bubbleTranslateY = useRef(
    new Animated.Value(isOwn || isServerDelivered ? 0 : REVEAL_SLIDE_PX),
  ).current;

  const [cardMounted, setCardMounted] = useState(!isOwn && !isServerDelivered);
  const [bubbleRevealed, setBubbleRevealed] = useState(isOwn || isServerDelivered);

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

  useEffect(() => {
    cardOpacity.setValue(1);
    openingOpacity.setValue(0);
    bubbleOpacity.setValue(isOwn || isServerDelivered ? 1 : 0);
    bubbleTranslateY.setValue(isOwn || isServerDelivered ? 0 : REVEAL_SLIDE_PX);
    setCardMounted(!isOwn && !isServerDelivered);
    setBubbleRevealed(isOwn || isServerDelivered);
    wasServerDeliveredRef.current = isServerDelivered;
  }, [
    bubbleOpacity,
    bubbleTranslateY,
    cardOpacity,
    isOwn,
    isServerDelivered,
    message.id,
    openingOpacity,
  ]);

  const isAwaitingContent = !isOwn && liveTracking.status === 'DELIVERED' && !isServerDelivered;
  const showIncomingCard = !isOwn && cardMounted;
  const showBubble = isOwn || isServerDelivered;

  useEffect(() => {
    if (!isAwaitingContent) {
      return;
    }

    Animated.timing(openingOpacity, {
      toValue: 1,
      duration: OPENING_FADE_MS,
      useNativeDriver: true,
    }).start();
  }, [isAwaitingContent, openingOpacity]);

  useEffect(() => {
    if (isOwn || !isServerDelivered || wasServerDeliveredRef.current) {
      wasServerDeliveredRef.current = isServerDelivered;
      return;
    }

    wasServerDeliveredRef.current = true;
    bubbleOpacity.setValue(0);
    bubbleTranslateY.setValue(REVEAL_SLIDE_PX);
    setBubbleRevealed(true);

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: REVEAL_FADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(openingOpacity, {
        toValue: 0,
        duration: REVEAL_FADE_MS * 0.7,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: REVEAL_FADE_MS,
        delay: 180,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleTranslateY, {
        toValue: 0,
        duration: REVEAL_FADE_MS,
        delay: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setCardMounted(false);
      }
    });
  }, [
    bubbleOpacity,
    bubbleTranslateY,
    cardOpacity,
    isOwn,
    isServerDelivered,
    openingOpacity,
  ]);

  if (isOwn) {
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.incomingTransition}>
        {showIncomingCard ? (
          <Animated.View style={{ opacity: cardOpacity }}>
            <TravelingCard
              arrivalAt={message.tracking.arrivalAt}
              departureAt={message.departureAt}
              liveTracking={liveTracking}
            />

            {isAwaitingContent ? (
              <Animated.View style={[styles.openingOverlay, { opacity: openingOpacity }]}>
                <ActivityIndicator color={theme.colors.primaryDark} size="small" />
                <Text style={styles.openingText}>Corvo chegou, abrindo mensagem...</Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        ) : null}

        {bubbleRevealed && showBubble ? (
          <Animated.View
            style={[
              showIncomingCard ? styles.bubbleDuringTransition : null,
              {
                opacity: bubbleOpacity,
                transform: [{ translateY: bubbleTranslateY }],
              },
            ]}>
            <MessageBubble
              content={message.content ?? ''}
              isOwn={isOwn}
              isDelivered={isServerDelivered}
              isRead={isServerRead}
              time={formatMessageTime(message.departureAt)}
            />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  incomingTransition: {
    position: 'relative',
  },
  bubbleDuringTransition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  openingOverlay: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(243, 230, 200, 0.88)',
  },
  openingText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: '#3D2B1F',
  },
});
