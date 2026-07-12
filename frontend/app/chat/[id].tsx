import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatComposer } from '@/components/chat/chat-composer';
import { ChatDetailHeader } from '@/components/chat/chat-detail-header';
import { ChatMessageItem } from '@/components/chat/chat-message-item';
import { useRefetchOnAppFocus } from '@/hooks/use-refetch-on-app-focus';
import { useTheme } from '@/hooks/use-theme';
import { chatsService } from '@/services/chats.service';
import { messagesService } from '@/services/messages.service';
import { useAuthStore } from '@/store/auth-store';
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
  const colors = useTheme();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [draft, setDraft] = useState('');

  const { data: chats } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.listMine(),
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
    refetchInterval: (query) => getMessagesRefetchInterval(query.state.data),
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const handleMessageDelivered = useCallback(() => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: ['chats'] });
  }, [queryClient, refetch]);

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

  function handleSend() {
    const content = draft.trim();

    if (!content || sendMutation.isPending) {
      return;
    }

    sendMutation.mutate(content);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ChatDetailHeader participantName={participantName} onBack={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        style={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
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
            contentContainerStyle={[
              styles.list,
              messages.length === 0 && styles.listEmpty,
            ]}
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma mensagem neste chat.</Text>
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
