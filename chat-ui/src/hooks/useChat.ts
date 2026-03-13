import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { fakeSocket, updateThreadWithMessage, mockUsers } from '@/lib/fakeSocket';
import { queryKeys } from '@/lib/queryClient';
import { Message, Thread, SocketEvent } from '@/types';
import { useTypingStore, useUIStore } from '@/store/uiStore';

// Hook to fetch threads
export function useThreads() {
  const queryClient = useQueryClient();
  const setUserTyping = useTypingStore((state) => state.setUserTyping);
  const selectedThreadId = useUIStore((state) => state.selectedThreadId);

  // Fetch threads
  const query = useQuery({
    queryKey: queryKeys.threads(),
    queryFn: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return fakeSocket.getThreads();
    },
  });

  // Subscribe to socket events
  useEffect(() => {
    const unsubscribe = fakeSocket.on((event: SocketEvent) => {
      switch (event.type) {
        case 'message:new': {
          const message = event.payload;
          
          // Update threads list
          queryClient.setQueryData<Thread[]>(queryKeys.threads(), (old) => {
            if (!old) return old;
            
            // Don't increment unread if the thread is currently selected
            const isCurrentThread = message.threadId === selectedThreadId;
            
            return old.map((thread) => {
              if (thread.id === message.threadId) {
                return {
                  ...thread,
                  lastMessage: message,
                  updatedAt: message.timestamp,
                  unreadCount: isCurrentThread ? 0 : thread.unreadCount + 1,
                };
              }
              return thread;
            }).sort((a, b) => 
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });
          
          // Update messages cache
          queryClient.setQueryData(
            queryKeys.messagesInfinite(message.threadId),
            (old: { pages: { messages: Message[]; nextCursor?: string; hasMore: boolean }[]; pageParams: unknown[] } | undefined) => {
              if (!old) return old;
              
              // Add message to the last page
              const newPages = [...old.pages];
              const lastPageIndex = newPages.length - 1;
              newPages[lastPageIndex] = {
                ...newPages[lastPageIndex],
                messages: [...newPages[lastPageIndex].messages, message],
              };
              
              return { ...old, pages: newPages };
            }
          );
          break;
        }

        case 'typing:start':
          setUserTyping(event.payload.threadId, event.payload.userId, true);
          break;

        case 'typing:stop':
          setUserTyping(event.payload.threadId, event.payload.userId, false);
          break;

        case 'thread:read': {
          const { threadId } = event.payload;
          queryClient.setQueryData<Thread[]>(queryKeys.threads(), (old) => {
            if (!old) return old;
            return old.map((thread) => {
              if (thread.id === threadId) {
                return { ...thread, unreadCount: 0 };
              }
              return thread;
            });
          });
          break;
        }

        case 'message:status': {
          const { messageId, status } = event.payload;
          // Update message status in all infinite query caches
          queryClient.setQueriesData<{
            pages: { messages: Message[]; nextCursor?: string; hasMore: boolean }[];
            pageParams: unknown[];
          }>(
            { queryKey: queryKeys.all },
            (data) => {
              if (!data?.pages) return data;
              
              return {
                ...data,
                pages: data.pages.map((page) => ({
                  ...page,
                  messages: page.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, status, isOptimistic: false } : msg
                  ),
                })),
              };
            }
          );
          break;
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient, setUserTyping, selectedThreadId]);

  return query;
}

// Hook to fetch messages with infinite scroll
export function useMessages(threadId: string | null) {
  return useInfiniteQuery({
    queryKey: queryKeys.messagesInfinite(threadId || ''),
    queryFn: async ({ pageParam }) => {
      if (!threadId) {
        return { messages: [], hasMore: false };
      }
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fakeSocket.getMessages(threadId, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    enabled: !!threadId,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten messages for easier access
      allMessages: data.pages.flatMap((page) => page.messages),
    }),
  });
}

// Hook to send a message
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string; content: string }) => {
      const message = fakeSocket.sendMessage(threadId, content);
      return message;
    },
    onMutate: async ({ threadId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.messagesInfinite(threadId) });
      await queryClient.cancelQueries({ queryKey: queryKeys.threads() });

      // Snapshot previous values
      const previousMessages = queryClient.getQueryData(queryKeys.messagesInfinite(threadId));
      const previousThreads = queryClient.getQueryData(queryKeys.threads());

      // Optimistic message
      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        threadId,
        senderId: 'current-user',
        content,
        timestamp: new Date(),
        status: 'sending',
        isOptimistic: true,
      };

      // Optimistically update messages
      queryClient.setQueryData(
        queryKeys.messagesInfinite(threadId),
        (old: { pages: { messages: Message[]; nextCursor?: string; hasMore: boolean }[]; pageParams: unknown[] } | undefined) => {
          if (!old) {
            return {
              pages: [{ messages: [optimisticMessage], hasMore: false }],
              pageParams: [undefined],
            };
          }

          const newPages = [...old.pages];
          const lastPageIndex = newPages.length - 1;
          newPages[lastPageIndex] = {
            ...newPages[lastPageIndex],
            messages: [...newPages[lastPageIndex].messages, optimisticMessage],
          };

          return { ...old, pages: newPages };
        }
      );

      // Optimistically update threads
      queryClient.setQueryData<Thread[]>(queryKeys.threads(), (old) => {
        if (!old) return old;
        return updateThreadWithMessage(old, optimisticMessage);
      });

      return { previousMessages, previousThreads, optimisticMessage };
    },
    onError: (_err, { threadId }, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(queryKeys.messagesInfinite(threadId), context.previousMessages);
      }
      if (context?.previousThreads) {
        queryClient.setQueryData(queryKeys.threads(), context.previousThreads);
      }
    },
    onSuccess: (message, { threadId }, context) => {
      // Replace optimistic message with real one
      queryClient.setQueryData(
        queryKeys.messagesInfinite(threadId),
        (old: { pages: { messages: Message[]; nextCursor?: string; hasMore: boolean }[]; pageParams: unknown[] } | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((msg) =>
                msg.id === context?.optimisticMessage.id ? message : msg
              ),
            })),
          };
        }
      );
    },
  });
}

// Hook to mark thread as read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useCallback((threadId: string) => {
    // Optimistically update
    queryClient.setQueryData<Thread[]>(queryKeys.threads(), (old) => {
      if (!old) return old;
      return old.map((thread) => {
        if (thread.id === threadId) {
          return { ...thread, unreadCount: 0 };
        }
        return thread;
      });
    });

    // Notify socket
    fakeSocket.markAsRead(threadId);
  }, [queryClient]);
}

// Hook to get user info
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(userId || ''),
    queryFn: () => {
      return mockUsers.find((u) => u.id === userId) || null;
    },
    enabled: !!userId,
  });
}

// Hook to get typing status
export function useTypingStatus(threadId: string | null) {
  const getTypingUsers = useTypingStore((state) => state.getTypingUsers);
  
  if (!threadId) return [];
  
  const typingUserIds = getTypingUsers(threadId);
  return typingUserIds.map((id) => mockUsers.find((u) => u.id === id)).filter(Boolean);
}
