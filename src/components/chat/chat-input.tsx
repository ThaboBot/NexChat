
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Send, Bot, Smile, Wand2, LoaderCircle, Sparkles } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { User, Message, Chat } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getSentiment, getRewrite, getAutoReply } from '@/lib/actions';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatInputProps {
  user: User;
  chat: Chat;
  onSendMessage: (message: Message) => Promise<void>;
}

export function ChatInput({ user, chat, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState<{ emoji: string; suggestion: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (message.trim().length > 10) {
        try {
          const result = await getSentiment({ message });
          setSentiment({ emoji: result.emotionEmoji, suggestion: result.suggestedToneCorrection });
        } catch (error) {
          // fail silently
        }
      } else {
        setSentiment(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [message]);

  const handleRewrite = async (style: string) => {
    if (!message) return;
    setIsProcessing(true);
    try {
      const result = await getRewrite({ message, style });
      setMessage(result.rewrittenMessage);
      toast({ title: `Rewritten as ${style}`, description: "Your message has been updated." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Rewrite failed' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleAutoReply = async () => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) {
        toast({ variant: 'destructive', title: 'No message to reply to.' });
        return;
    }
    setIsReplying(true);
    try {
        const userRoutine = "I am working on Project Nexa from 9 AM to 5 PM. I am available for quick questions but will respond to longer messages during my break at noon or after 5 PM.";
        const result = await getAutoReply({ userRoutine, incomingMessage: lastMessage.text });
        setMessage(result.autoReply);
        toast({ title: 'Auto-reply generated!', description: 'Based on your routine.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to generate auto-reply.' });
    } finally {
        setIsReplying(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isProcessing || isReplying) return;
    
    setIsProcessing(true);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: user,
      text: message,
      timestamp: Date.now(),
      emotion: sentiment?.emoji,
    };
    
    await onSendMessage(newMessage);
    
    setMessage('');
    setSentiment(null);
    setIsProcessing(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <TooltipProvider>
      <div className="p-4 border-t border-border bg-card/50">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="pr-40 min-h-[60px] resize-none bg-background"
            rows={1}
            disabled={isProcessing || isReplying}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <AnimatePresence>
            {sentiment?.emoji && !isProcessing && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Tooltip>
                    <TooltipTrigger>
                        <span className="text-2xl">{sentiment.emoji}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{sentiment.suggestion || "Tone seems good!"}</p>
                    </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
            </AnimatePresence>
            
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleAutoReply} disabled={isReplying || isProcessing}>
                       {isReplying ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <Sparkles className="h-5 w-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Generate Auto-Reply</p></TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isProcessing || isReplying}>
                      <Wand2 className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Rewrite message</p></TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRewrite('professional')}>Professional</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRewrite('funny')}>Funny</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRewrite('persuasive')}>Persuasive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" onClick={handleSend} disabled={!message.trim() || isProcessing || isReplying}>
                  {isProcessing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Send message</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
