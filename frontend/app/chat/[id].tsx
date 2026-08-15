import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatComposer } from '@/components/chat/chat-composer';
import { ChatDetailHeader } from '@/components/chat/chat-detail-header';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { useRefetchOnAppFocus } from '@/hooks/use-refetch-on-app-focus';
import { useJoinChat } from '@/components/providers/realtime-provider';
import { chatsService } from '@/services/chats.service';
import { messagesService } from '@/services/messages.service';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/store/auth-store';
import { useRealtimeStore } from '@/store/realtime-store';
import { theme } from '@/theme';
import type { Message } from '@/types/api';
import { getParticipantName } from '@/utils/chat-list';
import { getMessagesRefetchInterval } from '@/utils/message-tracking';

function sortMessagesChronologically(messages: Message[]): Message[] {
  return [...messages].sort(
    (left, right) =>
      new Date(left.departureAt).getTime() - new Date(right.departureAt).getTime(),
  );
}

export default function ChatScreen() {
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const realtimeConnected = useRealtimeStore((state) => state.connected);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const shouldStickToBottomRef = useRef(true);

  useJoinChat(id);

  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.listMine(),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', currentUserId],
    queryFn: () => usersService.getProfile(),
    enabled: Boolean(currentUserId),
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => messagesService.listByChat(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      if (realtimeConnected) {
        return false;
      }

      return getMessagesRefetchInterval(query.state.data);
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const handleMessageDelivered = useCallback(() => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ['chats'] });
    void queryClient.invalidateQueries({ queryKey: ['profile', currentUserId] });
  }, [currentUserId, queryClient, refetch]);

  useRefetchOnAppFocus(() => {
    void refetch();
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => messagesService.send(id, content),
    onSuccess: async () => {
      setDraft('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['messages', id] }),
        queryClient.invalidateQueries({ queryKey: ['chats'] }),
        queryClient.invalidateQueries({ queryKey: ['profile', currentUserId] }),
      ]);
    },
  });

  const participantName = useMemo(() => {
    const chat = chats?.find((item) => item.id === id);

    if (!chat) {
      const messageFromOther = data?.find((message) => message.senderId !== currentUserId);
      return messageFromOther?.senderName ?? 'Contato';
    }

    return getParticipantName(chat, currentUserId);
  }, [chats, currentUserId, data, id]);

  const messages = useMemo(() => sortMessagesChronologically(data ?? []), [data]);
  const lastMessage = messages.at(-1);

  const scrollToBottom = useCallback((animated = true) => {
    if (messages.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated });
    });
  }, [messages.length]);

  useEffect(() => {
    if (isLoading || messages.length === 0) {
      return;
    }

    shouldStickToBottomRef.current = true;
    scrollToBottom(false);
  }, [id, isLoading, scrollToBottom]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    shouldStickToBottomRef.current = true;
    scrollToBottom(true);
  }, [
    lastMessage?.id,
    lastMessage?.tracking.deliveredAt,
    lastMessage?.tracking.readAt,
    lastMessage?.tracking.status,
    messages.length,
    scrollToBottom,
  ]);

  const handleListScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    shouldStickToBottomRef.current = distanceFromBottom < 96;
  }, []);

  const handleContentSizeChange = useCallback(() => {
    if (!shouldStickToBottomRef.current) {
      return;
    }

    scrollToBottom(false);
  }, [scrollToBottom]);

  function handleSend() {
    const content = draft.trim();

    if (!content || sendMutation.isPending || (profile?.availableCrows ?? 0) === 0) {
      return;
    }

    sendMutation.mutate(content);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.atmosphere} pointerEvents="none">
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineDelayed]} />
      </View>

      <ChatDetailHeader participantName={participantName} onBack={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        style={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Não foi possível carregar as mensagens.</Text>
            <Pressable onPress={() => refetch()}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            contentContainerStyle={[
              styles.list,
              messages.length === 0 && styles.listEmpty,
            ]}
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={handleContentSizeChange}
            onScroll={handleListScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nenhuma carta ainda</Text>
                <Text style={styles.emptyText}>
                  Envie um corvo para começar esta correspondência.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatMessageItem
                currentUserId={currentUserId}
                message={item}
                onMessageDelivered={handleMessageDelivered}
              />
            )}
          />
        )}

        <ChatComposer
          availableCrows={profile?.availableCrows ?? 0}
          sending={sendMutation.isPending}
          value={draft}
          onChangeText={setDraft}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  atmosphere: {
    ...StyleSheet.absoluteFill,
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    left: '15%',
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(212, 166, 90, 0.08)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 120,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(91, 64, 40, 0.25)',
  },
  gridLine: {
    position: 'absolute',
    top: '28%',
    left: 24,
    right: 24,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(212, 166, 90, 0.08)',
  },
  gridLineDelayed: {
    top: '62%',
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  list: {
    flexGrow: 1,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.title,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  retryText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
});
