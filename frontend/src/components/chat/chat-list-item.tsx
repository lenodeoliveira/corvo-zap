import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';
import type { Chat } from '@/types/api';
import { getInitials } from '@/utils/avatar';
import {
  formatChatTimestamp,
  getLastMessage,
  getMessagePreview,
  getParticipantName,
  isIncomingTravelingMessage,
} from '@/utils/chat-list';

type ChatListItemProps = {
  chat: Chat;
  currentUserId: string;
};

export function ChatListItem({ chat, currentUserId }: ChatListItemProps) {
  const participantName = getParticipantName(chat, currentUserId);
  const lastMessage = getLastMessage(chat);
  const preview = getMessagePreview(lastMessage, currentUserId);
  const timestamp = formatChatTimestamp(lastMessage);
  const showTravelingBadge = isIncomingTravelingMessage(lastMessage, currentUserId);

  return (
    <Link href={`/chat/${chat.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(participantName)}</Text>
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {participantName}
          </Text>
          <Text numberOfLines={1} style={styles.preview}>
            {preview}
          </Text>
        </View>

        <View style={styles.meta}>
          {showTravelingBadge ? (
            <View style={styles.travelingBadge}>
              <Feather name="feather" size={14} color={theme.colors.black} />
            </View>
          ) : timestamp ? (
            <Text style={styles.timestamp}>{timestamp}</Text>
          ) : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  containerPressed: {
    backgroundColor: theme.colors.surface,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  preview: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  meta: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timestamp: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
  },
  travelingBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryDark,
  },
});
