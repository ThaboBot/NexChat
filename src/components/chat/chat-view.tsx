
"use client"

import React from 'react';
import type { Chat, User, Message } from '@/lib/types';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';

interface ChatViewProps {
  chat: Chat;
  user: User;
  onSendMessage: (message: Message) => Promise<void>;
  onPollVote: (pollId: string, optionId: string) => void;
}

export function ChatView({ chat, user, onSendMessage, onPollVote }: ChatViewProps) {
  const otherUser = chat.users.find(u => u.id !== user.id);
  const chatName = chat.isGroup ? chat.name || 'Group Chat' : otherUser?.name || 'Chat';
  const chatAvatar = chat.isGroup ? 'https://placehold.co/100x100/4B0082/FFFFFF.png' : otherUser?.avatar || '';

  return (
    <div className="flex flex-col flex-1 h-screen">
      <ChatHeader 
        chatName={chatName}
        chatAvatar={chatAvatar}
        memberCount={chat.users.length}
        isGroup={chat.isGroup}
        chatHistory={chat.messages.map(m => `${m.sender.name}: ${m.text}`).join('\n')}
      />
      <MessageList 
        messages={chat.messages} 
        user={user} 
        onPollVote={onPollVote}
      />
      <ChatInput 
        user={user}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
