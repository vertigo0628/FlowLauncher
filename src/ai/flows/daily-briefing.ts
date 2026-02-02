'use server';

/**
 * @fileOverview Provides a daily briefing, including weather, calendar, and app suggestions.
 *
 * - getDailyBriefing - A function that returns a daily briefing.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getWeatherForecast} from './get-weather-forecast';
import {getAppSuggestions} from './intelligent-app-suggestions';
import {INSTALLED_APPS} from '@/lib/apps';
import { DailyBriefingOutput, DailyBriefingOutputSchema } from '@/ai/types';

export async function getDailyBriefing(): Promise<DailyBriefingOutput> {
  return dailyBriefingFlow();
}

const prompt = ai.definePrompt({
    name: 'dailyBriefingPrompt',
    input: { schema: z.object({ 
        weather: z.string(), 
        calendarEvents: z.string(),
        appSuggestions: z.string(),
        timeOfDay: z.string(),
    })},
    output: { schema: DailyBriefingOutputSchema },
    prompt: `You are an AI assistant that provides a helpful daily briefing for a user.
    
    Current time of day: {{{timeOfDay}}}
    
    Here is the context you need:
    - Weather: {{{weather}}}
    - Today's Calendar Events: {{{calendarEvents}}}
    - App Suggestions: {{{appSuggestions}}}
    
    Based on this context, generate a concise and friendly daily briefing.
    - Create a greeting appropriate for the time of day.
    - Summarize the weather in a human-readable sentence.
    - Highlight the most important upcoming event from the calendar. If there are no events, state that.
    - Suggest one app from the list and give a short reason why.
    `,
});

const dailyBriefingFlow = ai.defineFlow(
  {
    name: 'dailyBriefingFlow',
    outputSchema: DailyBriefingOutputSchema,
  },
  async () => {
    const now = new Date();
    const hours = now.getHours();
    let timeOfDay = 'night';
    if (hours >= 5 && hours < 12) timeOfDay = 'morning';
    else if (hours >= 12 && hours < 17) timeOfDay = 'afternoon';
    else if (hours >= 17 && hours < 21) timeOfDay = 'evening';

    // 1. Get Weather
    const weatherForecast = await getWeatherForecast({ location: 'Mountain View' });
    const weatherString = `${'temperature' in weatherForecast ? weatherForecast.temperature : ''}°C and ${'condition' in weatherForecast ? weatherForecast.condition : ''} in ${'location' in weatherForecast ? weatherForecast.location : ''}`;

    // 2. Get Calendar Events (mocked)
    const calendarEvents = "10:00 AM: Project Sync, 2:00 PM: Dentist Appointment";

    // 3. Get App Suggestions
    const suggestionResult = await getAppSuggestions({
        timeOfDay,
        location: 'Home',
        usagePatterns: 'Frequently uses productivity and media apps.',
        installedApps: INSTALLED_APPS.map(app => app.name),
    });
    const appSuggestionsString = suggestionResult.suggestedApps.join(', ');

    // 4. Generate Briefing with LLM
    const {output} = await prompt({
        weather: weatherString,
        calendarEvents: calendarEvents,
        appSuggestions: appSuggestionsString,
        timeOfDay,
    });
    
    return output!;
  }
);
