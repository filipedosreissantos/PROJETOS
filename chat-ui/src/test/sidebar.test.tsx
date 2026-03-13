import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from './test-utils';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '@/components/chat/Sidebar';
import { Thread, User } from '@/types';
import { useUIStore } from '@/store/uiStore';

// Mock users
const mockCurrentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://example.com/you.jpg',
  status: 'online',
};

const mockUser1: User = {
  id: 'user-1',
  name: 'Cleopatra',
  avatar: 'https://example.com/cleopatra.jpg',
  status: 'online',
};

const mockUser2: User = {
  id: 'user-2',
  name: 'Nefertiti',
  avatar: 'https://example.com/nefertiti.jpg',
  status: 'away',
};

// Mock threads
const mockThreads: Thread[] = [
  {
    id: 'thread-user-1',
    participants: [mockCurrentUser, mockUser1],
    lastMessage: {
      id: 'msg-1',
      threadId: 'thread-user-1',
      senderId: 'user-1',
      content: 'The pyramid is almost ready!',
      timestamp: new Date(Date.now() - 60000),
      status: 'delivered',
    },
    unreadCount: 3,
    updatedAt: new Date(Date.now() - 60000),
  },
  {
    id: 'thread-user-2',
    participants: [mockCurrentUser, mockUser2],
    lastMessage: {
      id: 'msg-2',
      threadId: 'thread-user-2',
      senderId: 'current-user',
      content: 'See you at the temple',
      timestamp: new Date(Date.now() - 120000),
      status: 'read',
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 120000),
  },
];

// Reset store before each test
afterEach(() => {
  useUIStore.setState({
    selectedThreadId: null,
    searchQuery: '',
    isSidebarOpen: true,
    isMobile: false,
  });
});

describe('Sidebar', () => {
  it('should render thread list', () => {
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    expect(screen.getByText('Cleopatra')).toBeInTheDocument();
    expect(screen.getByText('Nefertiti')).toBeInTheDocument();
  });

  it('should show last message preview', () => {
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    expect(screen.getByText(/pyramid is almost ready/i)).toBeInTheDocument();
    expect(screen.getByText(/See you at the temple/i)).toBeInTheDocument();
  });

  it('should show unread badge when there are unread messages', () => {
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not show unread badge when no unread messages', () => {
    const threadsWithNoUnread = mockThreads.map(t => ({ ...t, unreadCount: 0 }));
    render(<Sidebar threads={threadsWithNoUnread} isLoading={false} isError={false} />);
    
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('should filter threads by search query', async () => {
    const user = userEvent.setup();
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    const searchInput = screen.getByPlaceholderText('Search conversations...');
    await user.type(searchInput, 'Cleopatra');
    
    expect(screen.getByText('Cleopatra')).toBeInTheDocument();
    expect(screen.queryByText('Nefertiti')).not.toBeInTheDocument();
  });

  it('should show empty state when no threads match search', async () => {
    const user = userEvent.setup();
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    const searchInput = screen.getByPlaceholderText('Search conversations...');
    await user.type(searchInput, 'Ramesses');
    
    expect(screen.getByText('No conversations found')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<Sidebar threads={undefined} isLoading={true} isError={false} />);
    
    // Should show skeleton loaders
    expect(screen.queryByText('Cleopatra')).not.toBeInTheDocument();
  });

  it('should show error state', () => {
    render(<Sidebar threads={undefined} isLoading={false} isError={true} />);
    
    expect(screen.getByText('Failed to load conversations')).toBeInTheDocument();
  });

  it('should select thread when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    const cleopatraThread = screen.getByText('Cleopatra').closest('button');
    await user.click(cleopatraThread!);
    
    expect(useUIStore.getState().selectedThreadId).toBe('thread-user-1');
  });

  it('should highlight selected thread', async () => {
    useUIStore.setState({ selectedThreadId: 'thread-user-1' });
    
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    const cleopatraThread = screen.getByText('Cleopatra').closest('button');
    expect(cleopatraThread).toHaveClass('active');
  });

  it('should show Nile Chat header', () => {
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    expect(screen.getByText('Nile Chat')).toBeInTheDocument();
    expect(screen.getByText('Sacred Messages of the Pharaoh')).toBeInTheDocument();
  });
});

describe('Thread Selection and Read Status', () => {
  it('should update selected thread in store', async () => {
    const user = userEvent.setup();
    render(<Sidebar threads={mockThreads} isLoading={false} isError={false} />);
    
    // Select first thread
    await user.click(screen.getByText('Cleopatra').closest('button')!);
    expect(useUIStore.getState().selectedThreadId).toBe('thread-user-1');
    
    // Select second thread
    await user.click(screen.getByText('Nefertiti').closest('button')!);
    expect(useUIStore.getState().selectedThreadId).toBe('thread-user-2');
  });
});
