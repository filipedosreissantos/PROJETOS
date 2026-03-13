import { useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from '@/lib/queryClient';
import { Sidebar, ChatArea } from '@/components/chat';
import { useThreads } from '@/hooks/useChat';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

function ChatApp() {
  const { data: threads, isLoading, isError } = useThreads();
  const { setIsMobile, isMobile, isSidebarOpen } = useUIStore();

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* Egyptian decorative corners */}
      <div className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-50 opacity-30">
        <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500">
          <path fill="currentColor" d="M0 0h16v4H4v12H0V0z" />
          <path fill="currentColor" d="M8 8h4v4H8V8z" opacity="0.5" />
        </svg>
      </div>
      <div className="fixed top-0 right-0 w-16 h-16 pointer-events-none z-50 opacity-30">
        <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500 transform scale-x-[-1]">
          <path fill="currentColor" d="M0 0h16v4H4v12H0V0z" />
          <path fill="currentColor" d="M8 8h4v4H8V8z" opacity="0.5" />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 w-16 h-16 pointer-events-none z-50 opacity-30">
        <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500 transform scale-y-[-1]">
          <path fill="currentColor" d="M0 0h16v4H4v12H0V0z" />
          <path fill="currentColor" d="M8 8h4v4H8V8z" opacity="0.5" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-16 h-16 pointer-events-none z-50 opacity-30">
        <svg viewBox="0 0 64 64" className="w-full h-full text-gold-500 transform scale-[-1]">
          <path fill="currentColor" d="M0 0h16v4H4v12H0V0z" />
          <path fill="currentColor" d="M8 8h4v4H8V8z" opacity="0.5" />
        </svg>
      </div>

      {/* Main Layout */}
      <div className={cn(
        'flex w-full h-full',
        isMobile && !isSidebarOpen && 'flex-col'
      )}>
        <Sidebar 
          threads={threads} 
          isLoading={isLoading} 
          isError={isError} 
        />
        <ChatArea threads={threads} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ChatApp />
    </PersistQueryClientProvider>
  );
}
