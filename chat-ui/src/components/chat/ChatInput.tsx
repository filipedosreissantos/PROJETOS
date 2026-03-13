import { useState, useRef, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { Button, SendIcon } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Write a message...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <div className="chat-input-area p-4">
      <div className="relative flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'chat-input min-h-[48px] max-h-[150px]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Message input"
          />
        </div>
        
        <Button
          variant="primary"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="h-12 w-12 p-0 flex-shrink-0"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>
      
      <p className="text-xs text-papyrus-600 mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 rounded bg-tomb-700 text-papyrus-400 text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-tomb-700 text-papyrus-400 text-xs">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
