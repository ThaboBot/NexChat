
'use server';

import { summarizeMessage, type SummarizeMessageInput } from '@/ai/flows/message-summarization';
import { translateMessage, type RealTimeTranslationInput } from '@/ai/flows/real-time-translation';
import { analyzeMessageSentiment, type AnalyzeMessageSentimentInput } from '@/ai/flows/emotionally-aware-messages';
import { rewriteMessage, type RewriteMessageInput } from '@/ai/flows/message-rewriter';
import { liveFactChecker, type LiveFactCheckerInput } from '@/ai/flows/live-fact-checker';
import { smartSchedulingAssistant, type SmartSchedulingAssistantInput } from '@/ai/flows/smart-scheduling-assistant';
import { analyzeChatPoll, type AnalyzeChatPollInput } from '@/ai/flows/chat-poll-analysis';
import { buildCustomAIAvatar, type CustomAIAvatarInput } from '@/ai/flows/custom-ai-avatar-builder';
import { generateAnimation, type GenerateAnimationInput } from '@/ai/flows/dynamic-message-animation';
import { generateAutoReply, type GenerateAutoReplyInput } from '@/ai/flows/auto-replies-based-on-routine';
import { getThemeAndMusic, type GetThemeAndMusicInput } from '@/ai/flows/mood-aware-themes';

export async function getSummary(input: SummarizeMessageInput) {
    return await summarizeMessage(input);
}

export async function getTranslation(input: RealTimeTranslationInput) {
    return await translateMessage(input);
}

export async function getSentiment(input: AnalyzeMessageSentimentInput) {
    return await analyzeMessageSentiment(input);
}

export async function getRewrite(input: RewriteMessageInput) {
    return await rewriteMessage(input);
}

export async function getFactCheck(input: LiveFactCheckerInput) {
    return await liveFactChecker(input);
}

export async function getScheduleSuggestions(input: SmartSchedulingAssistantInput) {
    return await smartSchedulingAssistant(input);
}

export async function getPollAnalysis(input: AnalyzeChatPollInput) {
    return await analyzeChatPoll(input);
}

export async function generateAvatar(input: CustomAIAvatarInput) {
    return await buildCustomAIAvatar(input);
}

export async function getAnimation(input: GenerateAnimationInput) {
    return await generateAnimation(input);
}

export async function getAutoReply(input: GenerateAutoReplyInput) {
    return await generateAutoReply(input);
}

export async function getMoodTheme(input: GetThemeAndMusicInput) {
    return await getThemeAndMusic(input);
}
