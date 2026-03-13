import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'gold';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        variant === 'gold' ? 'skeleton-gold' : 'skeleton',
        className
      )}
    />
  );
}

// Thread Skeleton
export function ThreadSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <Skeleton className="w-12 h-12 rounded-full" variant="gold" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" variant="gold" />
          <Skeleton className="h-3 w-8" variant="gold" />
        </div>
        <Skeleton className="h-3 w-full" variant="gold" />
      </div>
    </div>
  );
}

// Message Skeleton
export function MessageSkeleton({ isSent = false }: { isSent?: boolean }) {
  return (
    <div
      className={cn(
        'flex mb-4 animate-pulse',
        isSent ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex items-end gap-2', isSent && 'flex-row-reverse')}>
        {!isSent && <Skeleton className="w-8 h-8 rounded-full" variant="gold" />}
        <div
          className={cn(
            'space-y-2 max-w-xs',
            isSent ? 'items-end' : 'items-start'
          )}
        >
          <Skeleton
            className={cn(
              'h-16 rounded-2xl',
              isSent ? 'w-48 rounded-br-sm' : 'w-56 rounded-bl-sm'
            )}
            variant="gold"
          />
          <Skeleton className="h-3 w-12" variant="gold" />
        </div>
      </div>
    </div>
  );
}

// Chat Area Skeleton
export function ChatSkeleton() {
  return (
    <div className="flex-1 p-4 space-y-4">
      <MessageSkeleton isSent={false} />
      <MessageSkeleton isSent={true} />
      <MessageSkeleton isSent={false} />
      <MessageSkeleton isSent={true} />
      <MessageSkeleton isSent={false} />
    </div>
  );
}

// Sidebar Skeleton
export function SidebarSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <ThreadSkeleton key={i} />
      ))}
    </div>
  );
}
