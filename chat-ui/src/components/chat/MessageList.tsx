import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { Avatar, ChatSkeleton, LoaderIcon, ArrowDownIcon, PyramidIcon } from '@/components/ui';
import { Message, Thread, User } from '@/types';
import { formatMessageTime, formatDateSeparator, cn } from '@/lib/utils';
import { useTypingStatus } from '@/hooks/useChat';
import { CheckIcon, CheckCheckIcon, ClockIcon } from '@/components/ui';

interface MessageListProps {
  messages: Message[] | undefined;
  thread: Thread | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  currentUserId: string;
}

export function MessageList({
  messages,
  thread,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  currentUserId,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevMessagesLengthRef = useRef(0);

  const typingUsers = useTypingStatus(thread?.id || null);
  const otherUser = thread?.participants.find((p) => p.id !== currentUserId);

  // Scroll to bottom when new messages arrive (if user is near bottom)
  useEffect(() => {
    if (messages && messages.length > prevMessagesLengthRef.current) {
      const isNewMessage = messages.length - prevMessagesLengthRef.current === 1;
      
      if (isNearBottom || (isNewMessage && messages[messages.length - 1]?.senderId === currentUserId)) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevMessagesLengthRef.current = messages?.length || 0;
  }, [messages, isNearBottom, currentUserId]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if near bottom (within 100px)
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsNearBottom(nearBottom);
    setShowScrollButton(!nearBottom && (messages?.length || 0) > 10);

    // Load more when scrolling to top
    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      const previousScrollHeight = scrollHeight;
      fetchNextPage();
      
      // Maintain scroll position after loading more
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
        }
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messages?.length]);

  // Scroll to bottom button click
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group messages by date
  const groupedMessages = messages?.reduce<{ date: string; messages: Message[] }[]>(
    (groups, message) => {
      const date = formatDateSeparator(message.timestamp);
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ date, messages: [message] });
      }
      
      return groups;
    },
    []
  );

  if (!thread || !otherUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <PyramidIcon className="w-24 h-24 text-gold-500/30 mb-6" />
        <h2 className="font-egyptian text-2xl gradient-text-gold mb-2">
          Welcome to Nile Chat
        </h2>
        <p className="text-papyrus-400 max-w-sm">
          Select a conversation from the sacred scrolls to begin your journey through the messages of the ancients.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Messages Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Loading indicator for older messages */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <LoaderIcon className="w-6 h-6 text-gold-500" />
            <span className="ml-2 text-sm text-papyrus-400">Loading ancient messages...</span>
          </div>
        )}

        {/* Load more button */}
        {hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center">
            <button
              onClick={fetchNextPage}
              className="text-sm text-gold-400 hover:text-gold-300 py-2 px-4 rounded-full border border-gold-600/30 hover:border-gold-500/50 transition-colors"
            >
              Load older messages
            </button>
          </div>
        )}

        {/* Messages */}
        {groupedMessages?.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="divider-egyptian">
              <span>{group.date}</span>
            </div>

            {/* Messages in group */}
            {group.messages.map((message, messageIndex) => {
              const isSent = message.senderId === currentUserId;
              const showAvatar =
                !isSent &&
                (messageIndex === 0 ||
                  group.messages[messageIndex - 1]?.senderId !== message.senderId);

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSent={isSent}
                  showAvatar={showAvatar}
                  user={isSent ? undefined : otherUser}
                />
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers as User[]} />
        )}

        {/* Bottom anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="scroll-to-bottom animate-float"
          aria-label="Scroll to bottom"
        >
          <ArrowDownIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Message Bubble Component
interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar: boolean;
  user?: User;
}

const MessageBubble = memo(function MessageBubble({
  message,
  isSent,
  showAvatar,
  user,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex items-end gap-2 max-w-[80%]', isSent && 'flex-row-reverse')}>
        {/* Avatar */}
        {!isSent && (
          <div className="w-8 flex-shrink-0">
            {showAvatar && user && (
              <Avatar src={user.avatar} name={user.name} size="sm" />
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={cn('flex flex-col', isSent ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'px-4 py-2.5 max-w-prose break-words',
              isSent ? 'message-sent' : 'message-received',
              message.isOptimistic && 'opacity-70'
            )}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {/* Time & Status */}
          <div className={cn('flex items-center gap-1 mt-1 px-1', isSent && 'flex-row-reverse')}>
            <span className="text-xs text-papyrus-500">
              {formatMessageTime(message.timestamp)}
            </span>
            {isSent && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
});

// Message Status Component
function MessageStatus({ status }: { status: Message['status'] }) {
  switch (status) {
    case 'sending':
      return <ClockIcon className="w-3 h-3 text-papyrus-500" />;
    case 'sent':
      return <CheckIcon className="w-3 h-3 text-papyrus-400" />;
    case 'delivered':
      return <CheckCheckIcon className="w-3 h-3 text-papyrus-400" />;
    case 'read':
      return <CheckCheckIcon className="w-3 h-3 text-nile-400" />;
    default:
      return null;
  }
}

// Typing Indicator Component
function TypingIndicator({ users }: { users: User[] }) {
  const names = users.map((u) => u.name).join(', ');
  
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-8">
        {users[0] && <Avatar src={users[0].avatar} name={users[0].name} size="sm" />}
      </div>
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="ml-2 text-xs text-papyrus-400">{names} typing</span>
      </div>
    </div>
  );
}
