"use client"

import React, { useRef, useEffect } from 'react';
import type { Message, User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';

interface MessageListProps {
  messages: Message[];
  user: User;
  onPollVote: (pollId: string, optionId: string) => void;
}

export function MessageList({ messages, user, onPollVote }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="flex flex-col gap-4">
        {messages.map(message => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isMe={message.sender.id === user.id}
            onPollVote={onPollVote}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
