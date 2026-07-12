import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatListItem } from '@/components/chat/chat-list-item';
import { ChatSearchBar } from '@/components/chat/chat-search-bar';
import { ChatsHeader } from '@/components/chat/chats-header';
import { useTheme } from '@/hooks/use-theme';
import { chatsService } from '@/services/chats.service';
import { useAuthStore } from '@/store/auth-store';
import { theme } from '@/theme';
import type { Chat } from '@/types/api';
import { filterChats } from '@/utils/chat-list';

export default function ChatsScreen() {
  const colors = useTheme();
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['chats'],
    queryFn: () => chatsService.listMine(),
  });

  const filteredChats = useMemo(
    () => filterChats(data ?? [], searchQuery, currentUserId),
    [currentUserId, data, searchQuery],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ChatsHeader />
      <ChatSearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Não foi possível carregar os chats.</Text>
          <Pressable onPress={() => refetch()}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.list,
            filteredChats.length === 0 && styles.listEmpty,
          ]}
          data={filteredChats}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Nenhum chat encontrado para essa busca.'
                : 'Nenhum chat ainda. Inicie uma conversa para liberar seu corvo.'}
            </Text>
          }
          renderItem={({ item }) => (
            <ChatListItem chat={item} currentUserId={currentUserId} />
          )}
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
