'use server';

/**
 * @fileOverview Provides intelligent app suggestions based on usage patterns, time of day, and location.
 *
 * - `getAppSuggestions` - A function that returns a list of suggested apps.
 * - `AppSuggestionsInput` - The input type for the `getAppSuggestions` function.
 * - `AppSuggestionsOutput` - The return type for the `getAppSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppSuggestionsInputSchema = z.object({
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  location: z.string().describe('The user\u0027s current location (e.g., home, work, commuting).'),
  usagePatterns: z.string().describe('A description of the user\u0027s recent app usage patterns.'),
  installedApps: z.array(z.string()).describe('A list of the names of the apps installed on the device.'),
});
export type AppSuggestionsInput = z.infer<typeof AppSuggestionsInputSchema>;

const AppSuggestionsOutputSchema = z.object({
  suggestedApps: z.array(z.string()).describe('A list of app names suggested for the user based on their current context.'),
});
export type AppSuggestionsOutput = z.infer<typeof AppSuggestionsOutputSchema>;

export async function getAppSuggestions(input: AppSuggestionsInput): Promise<AppSuggestionsOutput> {
  return appSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appSuggestionsPrompt',
  input: {schema: AppSuggestionsInputSchema},
  output: {schema: AppSuggestionsOutputSchema},
  prompt: `You are an AI assistant that suggests apps to users based on their current context.

  The current time of day is: {{{timeOfDay}}}
  The user is currently: {{{location}}}
  The user's recent app usage patterns are: {{{usagePatterns}}}
  The user has the following apps installed: {{#each installedApps}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Based on this information, suggest a list of apps that the user is most likely to use right now.
  Respond with only the app names in the array. Do not include any explanation or intro/outro text. Limit the list to a maximum of 5 apps.
  Apps should be chosen from the user's installed apps. Do not suggest apps that are not installed.
  `,
});

const appSuggestionsFlow = ai.defineFlow(
  {
    name: 'appSuggestionsFlow',
    inputSchema: AppSuggestionsInputSchema,
    outputSchema: AppSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
