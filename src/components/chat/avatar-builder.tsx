"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAvatar } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Bot, RefreshCw, Play, Pause } from 'lucide-react';

export function AvatarBuilder() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ avatarImage: string; avatarBio: string; avatarVoice: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (result?.avatarVoice) {
      audioRef.current = new Audio(result.avatarVoice);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({ variant: 'destructive', title: 'Description is required' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const res = await generateAvatar({ avatarDescription: description });
      setResult(res);
      toast({ title: 'Avatar Generated!', description: 'Check out your new AI avatar.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate avatar.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary"/> AI Avatar Builder</DialogTitle>
        <DialogDescription>
          Describe your desired AI avatar. Be as detailed as you want!
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <Textarea 
          placeholder="e.g., A futuristic cyberpunk detective with neon blue eyes and a trench coat..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        {isLoading && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {result && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
               <Image src={result.avatarImage} alt="Generated Avatar" width={128} height={128} className="rounded-full border-4 border-primary shadow-lg" data-ai-hint="avatar portrait"/>
            </div>
            <p className="text-sm text-muted-foreground italic">"{result.avatarBio}"</p>
            <Button onClick={togglePlay} variant="outline" size="sm">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause Voice' : 'Play Voice'}
            </Button>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : <><RefreshCw className="h-4 w-4 mr-2" />Generate</>}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
