
"use client";

import React, { useState, useMemo } from 'react';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatView } from '@/components/chat/chat-view';
import type { Chat, User, Message, Poll } from '@/lib/types';
import { motion } from 'framer-motion';
import { getAnimation } from '@/lib/actions';

const loggedInUser: User = {
  id: 'user-1',
  name: 'You',
  avatar: 'https://placehold.co/100x100/9400D3/FFFFFF.png',
};

const otherUsers: User[] = [
  { id: 'user-2', name: 'Alex Cryp', avatar: 'https://placehold.co/100x100/7DF9FF/1A0029.png', isOnline: true },
  { id: 'user-3', name: 'Nina Quant', avatar: 'https://placehold.co/100x100/A020F0/FFFFFF.png', isOnline: false },
  { id: 'user-4', name: 'Dev Team', avatar: 'https://placehold.co/100x100/4B0082/FFFFFF.png', isOnline: true },
];

const initialPoll: Poll = {
  id: 'poll-1',
  question: 'Next feature to build?',
  options: [
    { id: 'opt-1', text: 'Holographic Chat', votes: 5 },
    { id: 'opt-2', text: 'Crypto Transfer', votes: 12 },
    { id: 'opt-3', text: 'More Mini-Games', votes: 3 },
  ],
};

const initialMessages: Message[] = [
    { id: 'msg-1', sender: otherUsers[0], text: "Hey, check out the new design mockups. I think they're ready for the next phase.", timestamp: Date.now() - 1000 * 60 * 10, animation: "message-fade-in" },
    { id: 'msg-2', sender: loggedInUser, text: "Looking great! The color palette is spot on. I'll start implementing the front-end components.", timestamp: Date.now() - 1000 * 60 * 8, animation: "message-fade-in" },
    { id: 'msg-3', sender: otherUsers[1], text: "Did we decide on the encryption standard? Quantum-encrypted messaging is the future, we should aim for that.", timestamp: Date.now() - 1000 * 60 * 6, animation: "message-fade-in" },
    { id: 'msg-4', sender: otherUsers[0], text: "Good point, Nina. Let's create a poll to get the whole team's input.", timestamp: Date.now() - 1000 * 60 * 5, animation: "message-fade-in" },
    { id: 'msg-5', sender: otherUsers[0], text: "Here is the poll:", timestamp: Date.now() - 1000 * 60 * 4, poll: initialPoll, animation: "message-fade-in" },
    { id: 'msg-6', sender: loggedInUser, text: "I've voted! Also, let's schedule a meeting for tomorrow to finalize the roadmap. Can you find a slot?", timestamp: Date.now() - 1000 * 60 * 2, emotion: "👍" },
];

const initialChats: Chat[] = [
  { id: 'chat-1', users: [loggedInUser, otherUsers[0]], messages: initialMessages, isGroup: false },
  { id: 'chat-2', users: [loggedInUser, otherUsers[1]], messages: [], isGroup: false },
  { id: 'chat-3', users: [loggedInUser, otherUsers[0], otherUsers[1]], messages: initialMessages, isGroup: true, name: "Project Nexa" },
];

export default function Home() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string>('chat-3');

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  const handleSendMessage = async (newMessage: Message) => {
    try {
      const animationResult = await getAnimation({ message: newMessage.text });
      let animationName = 'message-fade-in';
      const type = animationResult.animationType.toLowerCase();
      
      if (type.includes('bounc')) {
        animationName = 'message-bounce';
      } else if (type.includes('shak')) {
        animationName = 'message-shake';
      }
      newMessage.animation = animationName;
    } catch (e) {
      console.error("Failed to get message animation, using default.", e);
      newMessage.animation = 'message-fade-in';
    }

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...chat.messages, newMessage] };
        }
        return chat;
      });
    });
  };

  const handlePollVote = (pollId: string, optionId: string) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const newMessages = chat.messages.map(msg => {
            if (msg.poll && msg.poll.id === pollId) {
              const newOptions = msg.poll.options.map(opt => {
                if (opt.id === optionId) {
                  return { ...opt, votes: opt.votes + 1 };
                }
                return opt;
              });
              return { ...msg, poll: { ...msg.poll, options: newOptions }};
            }
            return msg;
          });
          return { ...chat, messages: newMessages };
        }
        return chat;
      });
    });
  };

  if (!activeChat) {
    return <div className="flex h-screen w-full items-center justify-center bg-background">Loading...</div>;
  }
  
  const contacts = chats.map(chat => {
    if (chat.isGroup) {
      return {
        id: chat.id,
        name: chat.name || "Group Chat",
        avatar: otherUsers[2].avatar, // Dev team avatar
        isOnline: true,
        lastMessage: chat.messages[chat.messages.length - 1]?.text.substring(0, 30) + '...' || "No messages yet"
      }
    }
    const otherUser = chat.users.find(u => u.id !== loggedInUser.id) || otherUsers[0];
    return {
      id: chat.id,
      name: otherUser.name,
      avatar: otherUser.avatar,
      isOnline: otherUser.isOnline,
      lastMessage: chat.messages[chat.messages.length - 1]?.text.substring(0, 30) + '...' || "No messages yet"
    }
  });


  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-full antialiased text-foreground bg-background"
    >
      <ChatSidebar 
        user={loggedInUser} 
        contacts={contacts}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
      />
      <ChatView
        chat={activeChat}
        user={loggedInUser}
        onSendMessage={handleSendMessage}
        onPollVote={handlePollVote}
      />
    </motion.main>
  );
}
