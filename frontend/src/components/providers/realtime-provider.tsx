import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';

import type { RealtimeEventPayload } from '@/realtime/realtime.events';
import { realtimeService } from '@/services/realtime.service';
import { useAuthStore } from '@/store/auth-store';
import { useRealtimeStore } from '@/store/realtime-store';
import type { Chat, Message } from '@/types/api';
import { mergeMessageIntoList } from '@/utils/merge-realtime-message';

function toMessage(payload: RealtimeEventPayload): Message {
  return payload.message as Message;
}

export function RealtimeProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setConnected = useRealtimeStore((state) => state.setConnected);

  useEffect(() => {
    if (!isHydrated || !token) {
      realtimeService.disconnect();
      setConnected(false);
      return;
    }

    realtimeService.connect(token);

    function handleMessageEvent(payload: RealtimeEventPayload) {
      const message = toMessage(payload);
      const { chatId } = payload;

      queryClient.setQueryData<Message[]>(['messages', chatId], (current) =>
        mergeMessageIntoList(current, message),
      );

      queryClient.setQueryData<Chat[]>(['chats'], (current) => {
        if (!current) {
          return current;
        }

        return current.map((chat) => {
          if (chat.id !== chatId) {
            return chat;
          }

          return {
            ...chat,
            messages: mergeMessageIntoList(chat.messages, message),
          };
        });
      });
    }

    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    realtimeService.onConnect(handleConnect);
    realtimeService.onDisconnect(handleDisconnect);
    realtimeService.onMessageCreated(handleMessageEvent);
    realtimeService.onMessageDelivered(handleMessageEvent);
    realtimeService.onMessageRead(handleMessageEvent);

    setConnected(realtimeService.isConnected());

    return () => {
      realtimeService.offConnect(handleConnect);
      realtimeService.offDisconnect(handleDisconnect);
      realtimeService.offMessageCreated(handleMessageEvent);
      realtimeService.offMessageDelivered(handleMessageEvent);
      realtimeService.offMessageRead(handleMessageEvent);
      realtimeService.disconnect();
      setConnected(false);
    };
  }, [isHydrated, queryClient, setConnected, token]);

  return children;
}

export function useJoinChat(chatId: string | undefined) {
  useEffect(() => {
    if (!chatId) {
      return;
    }

    const activeChatId = chatId;

    function joinCurrentChat() {
      realtimeService.joinChat(activeChatId);
    }

    if (realtimeService.isConnected()) {
      joinCurrentChat();
    }

    realtimeService.onConnect(joinCurrentChat);

    return () => {
      realtimeService.offConnect(joinCurrentChat);
    };
  }, [chatId]);
}
