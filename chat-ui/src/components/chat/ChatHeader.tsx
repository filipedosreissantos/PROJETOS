import { Avatar, Button, ChevronLeftIcon, MenuIcon } from '@/components/ui';
import { Thread } from '@/types';
import { useUIStore, useTypingStore } from '@/store/uiStore';
import { currentUser } from '@/lib/fakeSocket';

interface ChatHeaderProps {
  thread: Thread | undefined;
}

export function ChatHeader({ thread }: ChatHeaderProps) {
  const { isMobile, setSidebarOpen, setSelectedThread } = useUIStore();
  const typingUsers = useTypingStore((state) => 
    thread ? state.getTypingUsers(thread.id) : []
  );

  const otherUser = thread?.participants.find((p) => p.id !== currentUser.id);

  const handleBack = () => {
    if (isMobile) {
      setSidebarOpen(true);
      setSelectedThread(null);
    }
  };

  if (!thread || !otherUser) {
    return (
      <header className="h-16 px-4 flex items-center justify-between border-b border-gold-700/20 bg-tomb-800/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="icon" onClick={() => setSidebarOpen(true)}>
              <MenuIcon className="w-5 h-5" />
            </Button>
          )}
          <h2 className="font-egyptian text-lg gradient-text-gold">Nile Chat</h2>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-gold-700/20 bg-tomb-800/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="icon" onClick={handleBack}>
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
        )}
        
        <Avatar
          src={otherUser.avatar}
          name={otherUser.name}
          size="md"
          status={otherUser.status}
        />
        
        <div>
          <h2 className="font-medium text-papyrus-100">{otherUser.name}</h2>
          <p className="text-xs">
            {typingUsers.length > 0 ? (
              <span className="text-gold-400 animate-pulse">typing...</span>
            ) : otherUser.status === 'online' ? (
              <span className="text-nile-400">Online</span>
            ) : otherUser.status === 'away' ? (
              <span className="text-gold-500">Away</span>
            ) : (
              <span className="text-papyrus-500">Offline</span>
            )}
          </p>
        </div>
      </div>

      {/* Could add more actions here like call, video, info */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse-gold" title="Connected" />
      </div>
    </header>
  );
}
