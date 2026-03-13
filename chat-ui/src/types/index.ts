// User type
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

// Message type
export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isOptimistic?: boolean;
}

// Thread (Conversation) type
export interface Thread {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  isTyping?: string[]; // Array of user IDs who are typing
}

// Paginated Messages Response
export interface PaginatedMessages {
  messages: Message[];
  nextCursor?: string;
  hasMore: boolean;
}

// Socket Events
export type SocketEvent =
  | { type: 'message:new'; payload: Message }
  | { type: 'typing:start'; payload: { threadId: string; userId: string } }
  | { type: 'typing:stop'; payload: { threadId: string; userId: string } }
  | { type: 'thread:read'; payload: { threadId: string; userId: string } }
  | { type: 'message:status'; payload: { messageId: string; status: Message['status'] } }
  | { type: 'user:status'; payload: { userId: string; status: User['status'] } };

// UI State types
export interface UIState {
  selectedThreadId: string | null;
  isSidebarOpen: boolean;
  searchQuery: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Query Keys
export const queryKeys = {
  threads: ['threads'] as const,
  thread: (id: string) => ['thread', id] as const,
  messages: (threadId: string) => ['messages', threadId] as const,
  user: (id: string) => ['user', id] as const,
} as const;
