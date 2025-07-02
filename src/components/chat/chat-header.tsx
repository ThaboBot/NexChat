"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Users, CalendarPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getScheduleSuggestions } from '@/lib/actions';
import { format } from 'date-fns';

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  memberCount: number;
  isGroup: boolean;
  chatHistory: string;
}

export function ChatHeader({ chatName, chatAvatar, memberCount, isGroup, chatHistory }: ChatHeaderProps) {
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<any>(null);

  const handleSmartScheduling = async () => {
    setIsScheduling(true);
    try {
      const result = await getScheduleSuggestions({ chatHistory });
      if (result.events && result.events.length > 0) {
        setScheduleResult(result);
      } else {
        toast({
          title: "No Events Found",
          description: "The AI couldn't find any potential events to schedule in this chat.",
        });
        setScheduleResult(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scheduling Error",
        description: "Could not analyze chat for events.",
      });
      setScheduleResult(null);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <>
      <header className="flex items-center p-4 border-b border-border z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatAvatar} alt={chatName} />
            <AvatarFallback>{chatName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{chatName}</h2>
            {isGroup && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                {memberCount} members
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSmartScheduling} disabled={isScheduling}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                <span>{isScheduling ? 'Analyzing...' : 'Smart Schedule'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AlertDialog open={!!scheduleResult} onOpenChange={() => setScheduleResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🗓️ AI Schedule Suggestions</AlertDialogTitle>
            <AlertDialogDescription>
              The AI found the following potential events in your chat. Would you like to add them to your calendar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto p-2 space-y-2">
            {scheduleResult?.events.map((event: any, index: number) => (
              <div key={index} className="p-3 rounded-md border border-border bg-muted/50">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(event.startTime), "PPP p")}</p>
                {event.description && <p className="text-xs mt-1 text-muted-foreground">{event.description}</p>}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              toast({ title: "Success!", description: "Events have been added to your calendar (simulation)." });
              setScheduleResult(null);
            }}>Add to Calendar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
