import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Create Query Client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour (previously cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create persister for localStorage
export const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'nile-chat-query-cache',
  throttleTime: 1000,
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
});

// Query keys factory
export const queryKeys = {
  all: ['nile-chat'] as const,
  
  threads: () => [...queryKeys.all, 'threads'] as const,
  thread: (id: string) => [...queryKeys.all, 'thread', id] as const,
  
  messages: (threadId: string) => [...queryKeys.all, 'messages', threadId] as const,
  messagesInfinite: (threadId: string) => [...queryKeys.messages(threadId), 'infinite'] as const,
  
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.all, 'user', id] as const,
};
