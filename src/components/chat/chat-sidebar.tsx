"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Search, Settings } from 'lucide-react';
import { NexchatLogo } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { User, Contact } from '@/lib/types';
import { AvatarBuilder } from './avatar-builder';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ChatSidebarProps {
  user: User;
  contacts: Contact[];
  activeChatId: string;
  onChatSelect: (id: string) => void;
}

export function ChatSidebar({ user, contacts, activeChatId, onChatSelect }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider>
      <aside className="flex flex-col h-screen w-80 min-w-80 border-r border-border bg-card/50">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <NexchatLogo className="h-8 w-8" />
            <h1 className="text-xl font-bold text-primary font-headline">NEXCHAT</h1>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <nav className="p-4 pt-0 space-y-2">
            <AnimatePresence>
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => onChatSelect(contact.id)}
                    className={cn(
                      "flex items-center w-full p-3 rounded-lg text-left transition-colors duration-200",
                      activeChatId === contact.id
                        ? "bg-primary/20 text-primary-foreground"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 overflow-hidden">
                      <p className="font-semibold truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
        </ScrollArea>
        
        <div className="p-4 mt-auto border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bot className="h-5 w-5 text-primary" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI Avatar Builder</p>
                </TooltipContent>
              </Tooltip>
              <AvatarBuilder />
            </Dialog>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
