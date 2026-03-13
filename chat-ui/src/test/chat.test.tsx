import { describe, it, expect, vi } from 'vitest';
import { render, screen } from './test-utils';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList } from '@/components/chat/MessageList';
import { Message, Thread, User } from '@/types';

// Mock data
const mockUser: User = {
  id: 'user-1',
  name: 'Cleopatra',
  avatar: 'https://example.com/avatar.jpg',
  status: 'online',
};

const mockCurrentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://example.com/you.jpg',
  status: 'online',
};

const mockThread: Thread = {
  id: 'thread-user-1',
  participants: [mockCurrentUser, mockUser],
  unreadCount: 0,
  updatedAt: new Date(),
};

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    threadId: 'thread-user-1',
    senderId: 'user-1',
    content: 'Hello from the Nile!',
    timestamp: new Date(Date.now() - 60000),
    status: 'read',
  },
  {
    id: 'msg-2',
    threadId: 'thread-user-1',
    senderId: 'current-user',
    content: 'Greetings, Pharaoh!',
    timestamp: new Date(Date.now() - 30000),
    status: 'delivered',
  },
];

describe('ChatInput', () => {
  it('should render input field and send button', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    expect(screen.getByPlaceholderText('Write a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should call onSend when clicking send button with message', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    const input = screen.getByPlaceholderText('Write a message...');
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('should call onSend when pressing Enter', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    const input = screen.getByPlaceholderText('Write a message...');
    await user.type(input, 'Test message{Enter}');
    
    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('should not call onSend when pressing Shift+Enter', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    const input = screen.getByPlaceholderText('Write a message...');
    await user.type(input, 'Test message{Shift>}{Enter}{/Shift}');
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('should not send empty messages', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    expect(onSend).not.toHaveBeenCalled();
  });

  it('should clear input after sending', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);
    
    const input = screen.getByPlaceholderText('Write a message...');
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    expect(input).toHaveValue('');
  });

  it('should be disabled when disabled prop is true', () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled />);
    
    expect(screen.getByPlaceholderText('Write a message...')).toBeDisabled();
  });
});

describe('MessageList', () => {
  const defaultProps = {
    messages: mockMessages,
    thread: mockThread,
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    currentUserId: 'current-user',
  };

  it('should render messages', () => {
    render(<MessageList {...defaultProps} />);
    
    expect(screen.getByText('Hello from the Nile!')).toBeInTheDocument();
    expect(screen.getByText('Greetings, Pharaoh!')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<MessageList {...defaultProps} isLoading={true} />);
    
    // Should show skeleton/loading state
    expect(screen.queryByText('Hello from the Nile!')).not.toBeInTheDocument();
  });

  it('should show welcome message when no thread selected', () => {
    render(<MessageList {...defaultProps} thread={undefined} messages={undefined} />);
    
    expect(screen.getByText('Welcome to Nile Chat')).toBeInTheDocument();
  });

  it('should show load more button when hasNextPage is true', () => {
    render(<MessageList {...defaultProps} hasNextPage={true} />);
    
    expect(screen.getByText('Load older messages')).toBeInTheDocument();
  });

  it('should call fetchNextPage when load more button is clicked', async () => {
    const fetchNextPage = vi.fn();
    const user = userEvent.setup();
    
    render(<MessageList {...defaultProps} hasNextPage={true} fetchNextPage={fetchNextPage} />);
    
    await user.click(screen.getByText('Load older messages'));
    
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('should show loading indicator when fetching next page', () => {
    render(<MessageList {...defaultProps} isFetchingNextPage={true} hasNextPage={true} />);
    
    expect(screen.getByText('Loading ancient messages...')).toBeInTheDocument();
  });

  it('should display sent message on the right side', () => {
    render(<MessageList {...defaultProps} />);
    
    const sentMessage = screen.getByText('Greetings, Pharaoh!');
    // Check that the message bubble has the correct class structure
    expect(sentMessage.closest('[class*="message-sent"]')).toBeInTheDocument();
  });

  it('should display received message on the left side', () => {
    render(<MessageList {...defaultProps} />);
    
    const receivedMessage = screen.getByText('Hello from the Nile!');
    expect(receivedMessage.closest('[class*="message-received"]')).toBeInTheDocument();
  });
});

describe('Optimistic Updates', () => {
  it('should show optimistic message with sending status', () => {
    const optimisticMessage: Message = {
      id: 'optimistic-1',
      threadId: 'thread-user-1',
      senderId: 'current-user',
      content: 'Sending this message...',
      timestamp: new Date(),
      status: 'sending',
      isOptimistic: true,
    };

    render(
      <MessageList
        messages={[...mockMessages, optimisticMessage]}
        thread={mockThread}
        isLoading={false}
        isFetchingNextPage={false}
        hasNextPage={false}
        fetchNextPage={vi.fn()}
        currentUserId="current-user"
      />
    );
    
    expect(screen.getByText('Sending this message...')).toBeInTheDocument();
  });
});
