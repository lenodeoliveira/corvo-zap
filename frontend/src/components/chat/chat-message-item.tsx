import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import type { Message } from '@/types/api';
import { formatMessageTime } from '@/utils/format-message';

import { MessageBubble } from './message-bubble';
import { TravelingCard } from './traveling-card';

type ChatMessageItemProps = {
  message: Message;
  currentUserId: string;
};

export function ChatMessageItem({ message, currentUserId }: ChatMessageItemProps) {
  const isOwn = message.senderId === currentUserId;
  const isTraveling = message.tracking.status === 'TRAVELING';
  const isDelivered = message.tracking.status === 'DELIVERED';
  const showIncomingTravelingCard = !isOwn && isTraveling;
  const showBubble = isOwn || isDelivered;

  return (
    <View style={styles.container}>
      {showBubble ? (
        <MessageBubble
          content={message.content ?? ''}
          isOwn={isOwn}
          isDelivered={isDelivered}
          time={formatMessageTime(message.departureAt)}
        />
      ) : null}

      {showIncomingTravelingCard ? (
        <TravelingCard departureAt={message.departureAt} tracking={message.tracking} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
});
