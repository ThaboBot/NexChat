"use client";

import React, { useMemo, useState } from 'react';
import type { Poll } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPollAnalysis } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatPollProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export function ChatPoll({ poll, onVote }: ChatPollProps) {
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const totalVotes = useMemo(() => {
    return poll.options.reduce((sum, option) => sum + option.votes, 0);
  }, [poll.options]);

  const handleVote = (optionId: string) => {
    if (votedOption) {
      toast({
        title: "Already Voted",
        description: "You can only vote once per poll.",
        variant: "default",
      });
      return;
    }
    onVote(poll.id, optionId);
    setVotedOption(optionId);
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await getPollAnalysis({
        pollQuestion: poll.question,
        pollOptions: poll.options.map(o => o.text),
        voteCounts: poll.options.map(o => o.votes),
      });
      setAnalysisResult(result);
    } catch (e) {
      toast({ title: 'Analysis Failed', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="my-2 p-4 rounded-lg border border-border bg-background/50">
      <h4 className="font-semibold mb-3">{poll.question}</h4>
      <div className="space-y-3">
        {poll.options.map(option => {
          const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div key={option.id}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <button 
                  onClick={() => handleVote(option.id)}
                  disabled={!!votedOption}
                  className="font-medium text-left hover:text-primary disabled:cursor-not-allowed"
                >
                  {option.text}
                </button>
                <span className="text-xs text-muted-foreground">{option.votes} votes</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{totalVotes} total votes</p>
        <Button size="sm" variant="ghost" onClick={handleAnalysis} disabled={isAnalyzing}>
          <Bot className="h-4 w-4 mr-2" />
          {isAnalyzing ? "Analyzing..." : "Analyze Results"}
        </Button>
      </div>

      <AlertDialog open={!!analysisResult} onOpenChange={() => setAnalysisResult(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>📊 AI Poll Analysis</AlertDialogTitle>
            <AlertDialogDescription>
              Here's what the AI thinks about the poll results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-semibold">Winning Option</h5>
              <p className="text-muted-foreground">{analysisResult?.winningOption}</p>
            </div>
             <div>
              <h5 className="font-semibold">Summary</h5>
              <p className="text-muted-foreground">{analysisResult?.summary}</p>
            </div>
             <div>
              <h5 className="font-semibold">Sentiment</h5>
              <p className="text-muted-foreground">{analysisResult?.sentimentAnalysis}</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
