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
import { MoreVertical, Users, CalendarPlus, Paintbrush, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getScheduleSuggestions, getMoodTheme } from '@/lib/actions';
import { format } from 'date-fns';

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  memberCount: number;
  isGroup: boolean;
  chatHistory: string;
}

type MoodTheme = {
    mood: string;
    theme: {
        primary: string;
        background: string;
        accent: string;
    };
    music: string;
}

export function ChatHeader({ chatName, chatAvatar, memberCount, isGroup, chatHistory }: ChatHeaderProps) {
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<any>(null);
  const [isAnalyzingMood, setIsAnalyzingMood] = useState(false);
  const [moodResult, setMoodResult] = useState<MoodTheme | null>(null);

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

  const handleMoodAnalysis = async () => {
    setIsAnalyzingMood(true);
    try {
        const result = await getMoodTheme({ message: chatHistory });
        setMoodResult(result);
    } catch(e) {
        toast({ variant: 'destructive', title: 'Mood Analysis Failed' });
        setMoodResult(null);
    } finally {
        setIsAnalyzingMood(false);
    }
  };

  const applyTheme = () => {
    if (!moodResult) return;
    document.documentElement.style.setProperty('--background', moodResult.theme.background);
    document.documentElement.style.setProperty('--primary', moodResult.theme.primary);
    document.documentElement.style.setProperty('--accent', moodResult.theme.accent);
    toast({ title: 'Theme Applied!', description: `Switched to a ${moodResult.mood} theme.`});
    setMoodResult(null);
  }

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
              <DropdownMenuItem onClick={handleMoodAnalysis} disabled={isAnalyzingMood}>
                <Paintbrush className="mr-2 h-4 w-4" />
                <span>{isAnalyzingMood ? 'Analyzing...' : 'Analyze Mood'}</span>
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
      
      <AlertDialog open={!!moodResult} onOpenChange={() => setMoodResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🎨 AI Mood Analysis</AlertDialogTitle>
            <AlertDialogDescription>
              The AI detected a <span className="font-bold text-primary">{moodResult?.mood}</span> mood. It suggests the following theme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Color Palette</h5>
              <div className="flex gap-2">
                 <div className="flex-1 p-2 rounded-md" style={{ backgroundColor: `hsl(${moodResult?.theme.background})`}}>
                   <span style={{ color: `hsl(${moodResult?.theme.primary})`}}>Background</span>
                 </div>
                 <div className="flex-1 p-2 rounded-md" style={{ backgroundColor: `hsl(${moodResult?.theme.primary})`}}>
                   <span style={{ color: `hsl(${moodResult?.theme.background})`}}>Primary</span>
                 </div>
                 <div className="flex-1 p-2 rounded-md" style={{ backgroundColor: `hsl(${moodResult?.theme.accent})`}}>
                   <span style={{ color: `hsl(${moodResult?.theme.background})`}}>Accent</span>
                 </div>
              </div>
            </div>
             <div>
              <h5 className="font-semibold flex items-center gap-2"><Music className="h-4 w-4"/> Music Suggestion</h5>
              <p className="text-muted-foreground">{moodResult?.music}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyTheme}>Apply Theme</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
