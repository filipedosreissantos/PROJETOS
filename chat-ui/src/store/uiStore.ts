import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  selectedThreadId: string | null;
  isSidebarOpen: boolean;
  searchQuery: string;
  isMobile: boolean;
}

interface UIActions {
  setSelectedThread: (threadId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      // State
      selectedThreadId: null,
      isSidebarOpen: true,
      searchQuery: '',
      isMobile: false,

      // Actions
      setSelectedThread: (threadId) => 
        set({ selectedThreadId: threadId }),
      
      toggleSidebar: () => 
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setSidebarOpen: (open) => 
        set({ isSidebarOpen: open }),
      
      setSearchQuery: (query) => 
        set({ searchQuery: query }),
      
      setIsMobile: (isMobile) => 
        set({ isMobile }),
    }),
    {
      name: 'nile-chat-ui-storage',
      partialize: (state) => ({ 
        selectedThreadId: state.selectedThreadId,
      }),
    }
  )
);

// Typing state (not persisted)
interface TypingState {
  typingUsers: Map<string, Set<string>>; // threadId -> Set of userIds
}

interface TypingActions {
  setUserTyping: (threadId: string, userId: string, isTyping: boolean) => void;
  getTypingUsers: (threadId: string) => string[];
  clearTyping: (threadId: string) => void;
}

export const useTypingStore = create<TypingState & TypingActions>()((set, get) => ({
  typingUsers: new Map(),

  setUserTyping: (threadId, userId, isTyping) => {
    set((state) => {
      const newMap = new Map(state.typingUsers);
      const threadTyping = new Set(newMap.get(threadId) || []);
      
      if (isTyping) {
        threadTyping.add(userId);
      } else {
        threadTyping.delete(userId);
      }
      
      if (threadTyping.size === 0) {
        newMap.delete(threadId);
      } else {
        newMap.set(threadId, threadTyping);
      }
      
      return { typingUsers: newMap };
    });
  },

  getTypingUsers: (threadId) => {
    const typingUsers = get().typingUsers.get(threadId);
    return typingUsers ? Array.from(typingUsers) : [];
  },

  clearTyping: (threadId) => {
    set((state) => {
      const newMap = new Map(state.typingUsers);
      newMap.delete(threadId);
      return { typingUsers: newMap };
    });
  },
}));
