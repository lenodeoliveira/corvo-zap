import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatListItem } from '@/components/chat/chat-list-item';
import { ChatSearchBar } from '@/components/chat/chat-search-bar';
import { ChatsHeader } from '@/components/chat/chats-header';
import { UserListItem } from '@/components/chat/user-list-item';
import { useTheme } from '@/hooks/use-theme';
import { chatsService } from '@/services/chats.service';
import { usersService } from '@/services/users.service';
import { useAuthStore } from '@/store/auth-store';
import { theme } from '@/theme';
import type { Chat, User } from '@/types/api';
import { filterChats } from '@/utils/chat-list';
import { getOrCreateChat } from '@/utils/open-chat';
import { getUsersWithoutChat } from '@/utils/user-search';

type ListEntry =
  | { kind: 'chat'; chat: Chat }
  | { kind: 'user'; user: User };

type ListSection = {
  key: 'chats' | 'users';
  title: string;
  data: ListEntry[];
};

export default function ChatsScreen() {
  const colors = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userSearchMode, setUserSearchMode] = useState(false);
  const [openingUserId, setOpeningUserId] = useState<string | null>(null);

  const isSearchingUsers = userSearchMode || searchQuery.trim().length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.listMine(),
  });

  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users', debouncedSearch, userSearchMode],
    queryFn: () =>
      usersService.list({
        search: debouncedSearch || undefined,
        page: 1,
        limit: 20,
      }),
    enabled: isSearchingUsers,
  });

  const filteredChats = useMemo(
    () => filterChats(data ?? [], searchQuery, currentUserId),
    [currentUserId, data, searchQuery],
  );

  const filteredUsers = useMemo(() => {
    if (!isSearchingUsers || !usersResponse?.data) {
      return [];
    }

    return getUsersWithoutChat(usersResponse.data, data ?? [], currentUserId);
  }, [currentUserId, data, isSearchingUsers, usersResponse?.data]);

  const sections = useMemo((): ListSection[] => {
    const result: ListSection[] = [];

    if (filteredChats.length > 0) {
      result.push({
        key: 'chats',
        title: 'Conversas',
        data: filteredChats.map((chat) => ({ kind: 'chat', chat })),
      });
    }

    if (isSearchingUsers && filteredUsers.length > 0) {
      result.push({
        key: 'users',
        title: 'Pessoas',
        data: filteredUsers.map((user) => ({ kind: 'user', user })),
      });
    }

    return result;
  }, [filteredChats, filteredUsers, isSearchingUsers]);

  const openChatMutation = useMutation({
    mutationFn: (userId: string) => getOrCreateChat(currentUserId, userId, data),
    onMutate: (userId) => {
      setOpeningUserId(userId);
    },
    onSuccess: async (chat) => {
      setSearchQuery('');
      setUserSearchMode(false);
      await queryClient.invalidateQueries({ queryKey: ['chats'] });
      router.push(`/chat/${chat.id}`);
    },
    onSettled: () => {
      setOpeningUserId(null);
    },
  });

  function handleNewChat() {
    setUserSearchMode(true);
    setSearchQuery('');
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);

    if (value.trim().length === 0 && !userSearchMode) {
      return;
    }
  }

  const isListLoading = isLoading || (isSearchingUsers && isLoadingUsers);
  const isListError = isError || (isSearchingUsers && isUsersError);
  const hasNoResults = !isListLoading && !isListError && sections.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ChatsHeader onNewChat={handleNewChat} />
      <ChatSearchBar
        placeholder={
          userSearchMode ? 'Buscar usuário por nome ou e-mail' : 'Buscar conversas ou pessoas'
        }
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {isListLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isListError ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Não foi possível carregar os dados.</Text>
          <Pressable
            onPress={() => {
              void refetch();
              if (isSearchingUsers) {
                void refetchUsers();
              }
            }}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <SectionList
          contentContainerStyle={[styles.list, hasNoResults && styles.listEmpty]}
          sections={sections}
          keyExtractor={(item) =>
            item.kind === 'chat' ? `chat-${item.chat.id}` : `user-${item.user.id}`
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery || userSearchMode
                ? 'Nenhuma conversa ou pessoa encontrada para essa busca.'
                : 'Nenhum chat ainda. Toque em + ou busque alguém para iniciar uma conversa.'}
            </Text>
          }
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item }) => {
            if (item.kind === 'chat') {
              return <ChatListItem chat={item.chat} currentUserId={currentUserId} />;
            }

            return (
              <UserListItem
                loading={openingUserId === item.user.id}
                user={item.user}
                onPress={() => openChatMutation.mutate(item.user.id)}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: theme.spacing.md,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
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
