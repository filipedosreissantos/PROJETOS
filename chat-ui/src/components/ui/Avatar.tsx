import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export function Avatar({ src, name, size = 'md', status, className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusColors = {
    online: 'bg-nile-400',
    offline: 'bg-papyrus-600',
    away: 'bg-gold-500',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover',
            'ring-2 ring-gold-600/30 ring-offset-2 ring-offset-tomb-800',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-gold-600 to-gold-700',
            'text-tomb-900 font-semibold',
            'ring-2 ring-gold-600/30 ring-offset-2 ring-offset-tomb-800',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            'ring-2 ring-tomb-800',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
