import { useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Thread } from '@/types';
import { useMessages, useSendMessage, useMarkAsRead } from '@/hooks/useChat';
import { currentUser } from '@/lib/fakeSocket';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  threads: Thread[] | undefined;
}

export function ChatArea({ threads }: ChatAreaProps) {
  const { selectedThreadId, isMobile, isSidebarOpen } = useUIStore();
  const selectedThread = threads?.find((t) => t.id === selectedThreadId);
  
  const { 
    data: messagesData, 
    isLoading: isLoadingMessages,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMessages(selectedThreadId);
  
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Mark thread as read when selected
  useEffect(() => {
    if (selectedThreadId && selectedThread?.unreadCount && selectedThread.unreadCount > 0) {
      markAsRead(selectedThreadId);
    }
  }, [selectedThreadId, selectedThread?.unreadCount, markAsRead]);

  const handleSend = (content: string) => {
    if (!selectedThreadId) return;
    sendMessage.mutate({ threadId: selectedThreadId, content });
  };

  // On mobile, hide chat area when sidebar is open and no thread selected
  if (isMobile && isSidebarOpen) {
    return null;
  }

  return (
    <main className={cn(
      'flex-1 flex flex-col bg-tomb-900 min-h-0',
      isMobile && 'w-full'
    )}>
      <ChatHeader thread={selectedThread} />
      
      <MessageList
        messages={messagesData?.allMessages}
        thread={selectedThread}
        isLoading={isLoadingMessages}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        currentUserId={currentUser.id}
      />
      
      {selectedThread && (
        <ChatInput
          onSend={handleSend}
          disabled={sendMessage.isPending}
          placeholder={`Message ${selectedThread.participants.find(p => p.id !== currentUser.id)?.name || 'user'}...`}
        />
      )}
    </main>
  );
}
