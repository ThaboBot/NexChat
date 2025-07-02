
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ThumbsUp, MoreHorizontal, FileText, Languages, ShieldQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getSummary, getTranslation, getFactCheck } from '@/lib/actions';
import { ChatPoll } from './chat-poll';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
  onPollVote: (pollId: string, optionId:string) => void;
}

const animationClasses: { [key: string]: string } = {
  'message-bounce': 'animate-message-bounce',
  'message-shake': 'animate-message-shake',
  'message-fade-in': 'animate-message-fade-in',
};


export function ChatMessage({ message, isMe, onPollVote }: ChatMessageProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertContent, setAlertContent] = useState<{ title: string; description: React.ReactNode } | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  const handleAction = async (action: 'summarize' | 'translate' | 'fact-check') => {
    setIsProcessing(true);
    try {
      let result;
      switch (action) {
        case 'summarize':
          result = await getSummary({ message: message.text });
          setAlertContent({ title: "AI Summary", description: result.summary });
          break;
        case 'translate':
          result = await getTranslation({ message: message.text, targetLanguage: 'English' });
          setTranslatedText(result.translatedMessage);
          toast({ title: 'Translated to English', description: 'Showing translated message.' });
          break;
        case 'fact-check':
          result = await getFactCheck({ statement: message.text });
          setAlertContent({ 
            title: "AI Fact Check", 
            description: (
              <div>
                <p className={cn("font-bold", result.isCorrect ? "text-green-400" : "text-red-400")}>
                  {result.isCorrect ? "Statement appears to be correct." : "Statement may be incorrect."}
                </p>
                <p className="mt-2 text-sm">{result.explanation}</p>
                {result.source && <a href={result.source} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline mt-2 block">Source</a>}
              </div>
            )
          });
          break;
      }
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: `Could not perform ${action}.` });
    } finally {
      setIsProcessing(false);
    }
  };


  const animationClass = animationClasses[message.animation || 'message-fade-in'] || 'animate-message-fade-in';

  return (
    <>
      <motion.div
        className={cn("flex items-end gap-2", isMe ? "justify-end" : "justify-start", animationClass)}
        layout
      >
        {!isMe && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "group relative max-w-sm rounded-2xl px-4 py-2",
            isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-secondary rounded-bl-none"
          )}
        >
          {!isMe && <p className="text-xs font-bold text-primary mb-1">{message.sender.name}</p>}
          <p className="text-sm whitespace-pre-wrap">{translatedText || message.text}</p>
          {message.poll && <ChatPoll poll={message.poll} onVote={onPollVote} />}
          {message.emotion && (
            <div className="absolute -bottom-3 -right-2 bg-card p-1 rounded-full shadow-md">
              <span className="text-sm">{message.emotion}</span>
            </div>
          )}
          <div className={cn("absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity", isMe ? "-left-10" : "-right-10")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled={isProcessing} onClick={() => handleAction('summarize')}>
                  <FileText className="mr-2 h-4 w-4" /> Summarize
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isProcessing} onClick={() => handleAction('translate')}>
                   <Languages className="mr-2 h-4 w-4" /> Translate
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isProcessing} onClick={() => handleAction('fact-check')}>
                   <ShieldQuestion className="mr-2 h-4 w-4" /> Fact-Check
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isMe && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
      <AlertDialog open={!!alertContent} onOpenChange={() => setAlertContent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent?.title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              {alertContent?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
