import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLiveTracking } from '@/hooks/use-live-tracking';
import { theme } from '@/theme';
import type { Chat } from '@/types/api';
import { getInitials } from '@/utils/avatar';
import {
  formatChatTimestamp,
  formatTravelingPreview,
  getLastMessage,
  getMessagePreview,
  getParticipantName,
  isIncomingTravelingMessage,
  isOutgoingTravelingMessage,
  isTravelingMessage,
} from '@/utils/chat-list';

type ChatListItemProps = {
  chat: Chat;
  currentUserId: string;
};

export function ChatListItem({ chat, currentUserId }: ChatListItemProps) {
  const participantName = getParticipantName(chat, currentUserId);
  const lastMessage = getLastMessage(chat);
  const timestamp = formatChatTimestamp(lastMessage);
  const traveling = isTravelingMessage(lastMessage);
  const incomingTraveling = isIncomingTravelingMessage(lastMessage, currentUserId);
  const outgoingTraveling = isOutgoingTravelingMessage(lastMessage, currentUserId);

  const liveTracking = useLiveTracking({
    departureAt: lastMessage?.departureAt ?? new Date(0).toISOString(),
    arrivalAt: lastMessage?.tracking.arrivalAt ?? new Date(0).toISOString(),
    distanceKm: lastMessage?.tracking.distanceKm ?? 0,
  });

  const preview =
    traveling && lastMessage
      ? formatTravelingPreview(
          lastMessage,
          lastMessage.senderId === currentUserId,
          liveTracking.status === 'TRAVELING'
            ? {
                progress: liveTracking.progress,
                remainingMinutes: liveTracking.remainingMinutes,
              }
            : undefined,
        )
      : getMessagePreview(lastMessage, currentUserId);

  return (
    <Link href={`/chat/${chat.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}>
        <View style={[styles.avatar, traveling && styles.avatarTraveling]}>
          <Text style={styles.avatarText}>{getInitials(participantName)}</Text>
          {traveling ? (
            <View
              style={[
                styles.avatarBadge,
                incomingTraveling ? styles.avatarBadgeIncoming : styles.avatarBadgeOutgoing,
              ]}>
              <Feather name="feather" size={10} color={theme.colors.black} />
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text numberOfLines={1} style={styles.name}>
              {participantName}
            </Text>
            {timestamp && !traveling ? (
              <Text style={styles.timestamp}>{timestamp}</Text>
            ) : null}
          </View>

          <Text
            numberOfLines={1}
            style={[styles.preview, traveling && styles.previewTraveling]}>
            {preview}
          </Text>

          {traveling && liveTracking.status === 'TRAVELING' ? (
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${liveTracking.progress}%`,
                    backgroundColor: incomingTraveling
                      ? theme.colors.primary
                      : theme.colors.success,
                  },
                ]}
              />
            </View>
          ) : null}
        </View>

        {traveling ? (
          <View style={styles.meta}>
            <Text style={styles.progressValue}>{liveTracking.progress}%</Text>
            <Text style={styles.metaHint}>
              {outgoingTraveling ? 'enviado' : 'a chegar'}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  containerPressed: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
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
  avatarTraveling: {
    borderColor: theme.colors.primaryDark,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  avatarBadgeIncoming: {
    backgroundColor: theme.colors.primary,
  },
  avatarBadgeOutgoing: {
    backgroundColor: theme.colors.success,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.secondary,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  name: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  preview: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  previewTraveling: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  progressTrack: {
    height: 3,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.pill,
  },
  meta: {
    flexShrink: 0,
    minWidth: 56,
    paddingLeft: theme.spacing.xs,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  timestamp: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
  },
  progressValue: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  metaHint: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 10,
    color: theme.colors.text.disabled,
  },
});
