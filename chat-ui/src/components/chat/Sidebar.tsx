import { memo } from 'react';
import { Avatar, SidebarSkeleton, SearchIcon, EmptyInboxIcon, AnkhIcon } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Thread } from '@/types';
import { useUIStore, useTypingStore } from '@/store/uiStore';
import { formatRelativeTime, truncateText, cn } from '@/lib/utils';
import { currentUser } from '@/lib/fakeSocket';

interface SidebarProps {
  threads: Thread[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function Sidebar({ threads, isLoading, isError }: SidebarProps) {
  const { selectedThreadId, searchQuery, setSelectedThread, setSearchQuery, isSidebarOpen, setSidebarOpen, isMobile } = useUIStore();

  // Filter threads by search query
  const filteredThreads = threads?.filter((thread) => {
    if (!searchQuery) return true;
    const otherUser = thread.participants.find((p) => p.id !== currentUser.id);
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           thread.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectThread = (threadId: string) => {
    setSelectedThread(threadId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-tomb-800/95 border-r border-gold-700/20',
        'transition-all duration-300 ease-in-out',
        isMobile ? (isSidebarOpen ? 'fixed inset-0 z-50 w-full' : 'hidden') : 'w-80 lg:w-96'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gold-700/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <AnkhIcon className="w-8 h-8 text-gold-500" />
          </div>
          <div>
            <h1 className="font-egyptian text-xl gradient-text-gold">Nile Chat</h1>
            <p className="text-xs text-papyrus-500">Sacred Messages of the Pharaoh</p>
          </div>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<SearchIcon className="w-4 h-4" />}
        />
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto py-2">
        {isLoading ? (
          <SidebarSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <EmptyInboxIcon className="w-16 h-16 text-terracotta-500/50 mb-4" />
            <p className="text-papyrus-400">Failed to load conversations</p>
            <p className="text-sm text-papyrus-600">Please try again later</p>
          </div>
        ) : filteredThreads?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <EmptyInboxIcon className="w-16 h-16 text-gold-500/30 mb-4" />
            <p className="text-papyrus-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-papyrus-600">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {filteredThreads?.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={selectedThreadId === thread.id}
                onClick={() => handleSelectThread(thread.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gold-700/20">
        <div className="flex items-center gap-3">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.name}
            size="md"
            status={currentUser.status}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-papyrus-100 truncate">{currentUser.name}</p>
            <p className="text-xs text-nile-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Thread Item Component
interface ThreadItemProps {
  thread: Thread;
  isSelected: boolean;
  onClick: () => void;
}

const ThreadItem = memo(function ThreadItem({ thread, isSelected, onClick }: ThreadItemProps) {
  const otherUser = thread.participants.find((p) => p.id !== currentUser.id);
  const typingUsers = useTypingStore((state) => state.getTypingUsers(thread.id));
  const isTyping = typingUsers.length > 0;

  if (!otherUser) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'thread-item w-full text-left',
        isSelected && 'active'
      )}
    >
      <Avatar
        src={otherUser.avatar}
        name={otherUser.name}
        size="lg"
        status={otherUser.status}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-papyrus-100 truncate">
            {otherUser.name}
          </span>
          <span className="text-xs text-papyrus-500 flex-shrink-0">
            {thread.lastMessage && formatRelativeTime(thread.lastMessage.timestamp)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          {isTyping ? (
            <span className="text-sm text-gold-400 italic">typing...</span>
          ) : (
            <span className="text-sm text-papyrus-400 truncate">
              {thread.lastMessage
                ? truncateText(thread.lastMessage.content, 40)
                : 'No messages yet'}
            </span>
          )}
          
          {thread.unreadCount > 0 && (
            <span className="badge-unread ml-2">
              {thread.unreadCount > 99 ? '99+' : thread.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
});
