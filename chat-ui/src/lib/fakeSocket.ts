import { Message, SocketEvent, User, Thread } from '@/types';

type EventCallback = (event: SocketEvent) => void;

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Cleopatra',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=cleopatra&backgroundColor=d4af37',
    status: 'online',
  },
  {
    id: 'user-2',
    name: 'Nefertiti',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=nefertiti&backgroundColor=1e5aaf',
    status: 'online',
  },
  {
    id: 'user-3',
    name: 'Ramesses II',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ramesses&backgroundColor=c45c4d',
    status: 'away',
  },
  {
    id: 'user-4',
    name: 'Tutankhamun',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=tutankhamun&backgroundColor=2aa3a3',
    status: 'offline',
  },
  {
    id: 'user-5',
    name: 'Hatshepsut',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=hatshepsut&backgroundColor=d4c4a1',
    status: 'online',
  },
  {
    id: 'current-user',
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=you&backgroundColor=b8942f',
    status: 'online',
  },
];

export const currentUser = mockUsers.find(u => u.id === 'current-user')!;

// Generate mock messages
const generateMockMessages = (threadId: string, count: number, startIndex: number = 0): Message[] => {
  const otherUserId = threadId.replace('thread-', 'user-');
  const messages: Message[] = [];
  
  const egyptianPhrases = [
    'May the blessings of Ra be upon you! ☀️',
    'Have you seen the new pyramids they are building?',
    'The Nile is beautiful this time of year 🌊',
    'I shall prepare the sacred scrolls for the ceremony',
    'The pharaoh has requested your presence at the temple',
    'What do you think of the new hieroglyph designs?',
    'The merchants from Nubia have arrived with gold',
    'Let us meet at the obelisk at sunset',
    'May Osiris guide your path 🌙',
    'The scribes are working on the new decree',
    'Have you tasted the dates from the eastern gardens?',
    'The astronomers predict a favorable alignment tonight',
    'I heard the great library has new scrolls from Alexandria',
    'The artisans finished the golden mask yesterday',
    'May your journey through the afterlife be blessed',
    'The cats are sacred, treat them with respect 🐱',
    'Wine from the delta vineyards is exquisite this season',
    'The chariot races start at midday tomorrow',
  ];
  
  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const isSent = index % 3 !== 0; // 2/3 are sent, 1/3 received
    messages.push({
      id: `msg-${threadId}-${index}`,
      threadId,
      senderId: isSent ? 'current-user' : otherUserId,
      content: egyptianPhrases[index % egyptianPhrases.length],
      timestamp: new Date(Date.now() - (count - index) * 1000 * 60 * 5), // 5 minutes apart
      status: 'read',
    });
  }
  
  return messages;
};

// Initial mock threads
export const mockThreads: Thread[] = mockUsers
  .filter(u => u.id !== 'current-user')
  .map((user, index) => ({
    id: `thread-${user.id}`,
    participants: [currentUser, user],
    lastMessage: {
      id: `msg-thread-${user.id}-last`,
      threadId: `thread-${user.id}`,
      senderId: index % 2 === 0 ? 'current-user' : user.id,
      content: index === 0 
        ? 'The pyramid construction is almost complete! 🏛️'
        : index === 1
        ? 'May the gods bless your reign'
        : index === 2
        ? 'See you at the temple ceremony'
        : 'The scrolls have been delivered',
      timestamp: new Date(Date.now() - index * 1000 * 60 * 30), // 30 minutes apart
      status: 'read',
    },
    unreadCount: index === 0 ? 3 : index === 2 ? 1 : 0,
    updatedAt: new Date(Date.now() - index * 1000 * 60 * 30),
    isTyping: [],
  }));

// In-memory message store
const messageStore: Map<string, Message[]> = new Map();
mockThreads.forEach(thread => {
  messageStore.set(thread.id, generateMockMessages(thread.id, 30));
});

// FakeSocket class - EventEmitter pattern
class FakeSocket {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private autoMessageInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // Start auto-messaging simulation
    this.startAutoMessages();
  }
  
  // Subscribe to events
  on(callback: EventCallback): () => void {
    if (!this.listeners.has('all')) {
      this.listeners.set('all', new Set());
    }
    this.listeners.get('all')!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get('all')?.delete(callback);
    };
  }
  
  // Emit events to all listeners
  emit(event: SocketEvent): void {
    this.listeners.get('all')?.forEach(callback => callback(event));
  }
  
  // Send a message (simulates network delay)
  sendMessage(threadId: string, content: string): Message {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      senderId: 'current-user',
      content,
      timestamp: new Date(),
      status: 'sending',
      isOptimistic: true,
    };
    
    // Add to store
    const messages = messageStore.get(threadId) || [];
    messages.push(message);
    messageStore.set(threadId, messages);
    
    // Simulate network delay for status updates
    setTimeout(() => {
      message.status = 'sent';
      message.isOptimistic = false;
      this.emit({ type: 'message:status', payload: { messageId: message.id, status: 'sent' } });
      
      setTimeout(() => {
        message.status = 'delivered';
        this.emit({ type: 'message:status', payload: { messageId: message.id, status: 'delivered' } });
        
        // Trigger typing indicator from other user
        this.simulateTyping(threadId);
      }, 500);
    }, 300);
    
    return message;
  }
  
  // Simulate typing indicator
  private simulateTyping(threadId: string): void {
    const otherUserId = threadId.replace('thread-', '');
    
    // Clear existing timeout for this thread
    if (this.typingTimeouts.has(threadId)) {
      clearTimeout(this.typingTimeouts.get(threadId)!);
    }
    
    // Start typing
    setTimeout(() => {
      this.emit({ type: 'typing:start', payload: { threadId, userId: otherUserId } });
      
      // Stop typing and send response after random delay
      const timeout = setTimeout(() => {
        this.emit({ type: 'typing:stop', payload: { threadId, userId: otherUserId } });
        
        // Send response message
        this.receiveMessage(threadId, otherUserId);
      }, 1500 + Math.random() * 2000);
      
      this.typingTimeouts.set(threadId, timeout);
    }, 500);
  }
  
  // Receive a message from another user
  private receiveMessage(threadId: string, senderId: string): void {
    const responses = [
      'I understand, my friend! 🏛️',
      'The gods smile upon us today',
      'That is wonderful news!',
      'Let us discuss this further at the palace',
      'Your wisdom is like the great Thoth himself',
      'Indeed, the Nile provides for all',
      'May Ra illuminate your path ☀️',
      'The scribes shall record this moment',
    ];
    
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      senderId,
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      status: 'delivered',
    };
    
    // Add to store
    const messages = messageStore.get(threadId) || [];
    messages.push(message);
    messageStore.set(threadId, messages);
    
    // Emit new message event
    this.emit({ type: 'message:new', payload: message });
  }
  
  // Start auto-messaging simulation
  private startAutoMessages(): void {
    this.autoMessageInterval = setInterval(() => {
      // Random chance to receive a message
      if (Math.random() > 0.7) {
        const randomThread = mockThreads[Math.floor(Math.random() * mockThreads.length)];
        const otherUser = randomThread.participants.find(p => p.id !== 'current-user');
        
        if (otherUser) {
          // Show typing first
          this.emit({ 
            type: 'typing:start', 
            payload: { threadId: randomThread.id, userId: otherUser.id } 
          });
          
          setTimeout(() => {
            this.emit({ 
              type: 'typing:stop', 
              payload: { threadId: randomThread.id, userId: otherUser.id } 
            });
            this.receiveMessage(randomThread.id, otherUser.id);
          }, 2000);
        }
      }
    }, 15000); // Every 15 seconds, 30% chance
  }
  
  // Mark thread as read
  markAsRead(threadId: string): void {
    this.emit({ 
      type: 'thread:read', 
      payload: { threadId, userId: 'current-user' } 
    });
  }
  
  // Get messages for a thread (with pagination)
  getMessages(threadId: string, cursor?: string, limit: number = 20): {
    messages: Message[];
    nextCursor?: string;
    hasMore: boolean;
  } {
    const allMessages = messageStore.get(threadId) || [];
    
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = allMessages.findIndex(m => m.id === cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex;
      }
    } else {
      // Start from the end (newest messages first, but we load older ones)
      startIndex = Math.max(0, allMessages.length - limit);
    }
    
    const endIndex = cursor ? startIndex : allMessages.length;
    const sliceStart = Math.max(0, startIndex - limit);
    
    const messages = cursor 
      ? allMessages.slice(sliceStart, startIndex)
      : allMessages.slice(startIndex, endIndex);
    
    const hasMore = sliceStart > 0 || (cursor ? sliceStart > 0 : startIndex > 0);
    const nextCursor = hasMore ? messages[0]?.id : undefined;
    
    return {
      messages,
      nextCursor,
      hasMore,
    };
  }
  
  // Get all threads
  getThreads(): Thread[] {
    return mockThreads.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  
  // Cleanup
  destroy(): void {
    if (this.autoMessageInterval) {
      clearInterval(this.autoMessageInterval);
    }
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();
    this.listeners.clear();
  }
}

// Singleton instance
export const fakeSocket = new FakeSocket();

// Helper to update thread on new message
export const updateThreadWithMessage = (threads: Thread[], message: Message): Thread[] => {
  return threads.map(thread => {
    if (thread.id === message.threadId) {
      return {
        ...thread,
        lastMessage: message,
        updatedAt: message.timestamp,
        unreadCount: message.senderId !== 'current-user' 
          ? thread.unreadCount + 1 
          : thread.unreadCount,
      };
    }
    return thread;
  }).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};
