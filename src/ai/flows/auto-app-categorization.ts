'use server';

/**
 * @fileOverview Automatically categorizes apps into logical groups.
 *
 * - categorizeApps - A function that categorizes a list of apps.
 */

import {ai} from '@/ai/genkit';
import {
  CategorizeAppsInput,
  CategorizeAppsInputSchema,
  CategorizeAppsOutput,
  CategorizeAppsOutputSchema,
} from '@/ai/types';

export async function categorizeApps(input: CategorizeAppsInput): Promise<CategorizeAppsOutput> {
  return categorizeAppsFlow(input);
}

const categorizeAppsPrompt = ai.definePrompt({
  name: 'categorizeAppsPrompt',
  input: {schema: CategorizeAppsInputSchema},
  output: {schema: CategorizeAppsOutputSchema},
  prompt: `You are an expert app classifier. Given a list of app names, you will classify each app into one of the following categories: Social, Media, Games, Productivity, Utilities, or Other.

  Return a JSON object with a single key "categorizations", which is an array of objects. Each object in the array should have two keys: "appName" (the name of the app) and "category" (the assigned category).

  Here are the apps to categorize:
  {{#each appNames}}
  - "{{this}}"
  {{/each}}`,
});

const categorizeAppsFlow = ai.defineFlow(
  {
    name: 'categorizeAppsFlow',
    inputSchema: CategorizeAppsInputSchema,
    outputSchema: CategorizeAppsOutputSchema,
  },
  async input => {
    const {output} = await categorizeAppsPrompt(input);
    return output!;
  }
);
