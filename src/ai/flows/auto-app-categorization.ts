'use server';

/**
 * @fileOverview Automatically categorizes apps into logical groups.
 *
 * - categorizeApps - A function that categorizes a list of apps.
 * - CategorizeAppsInput - The input type for the categorizeApps function.
 * - CategorizeAppsOutput - The return type for the categorizeApps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeAppsInputSchema = z.object({
  appNames: z.array(z.string()).describe('A list of application names to categorize.'),
});
export type CategorizeAppsInput = z.infer<typeof CategorizeAppsInputSchema>;

const CategorizeAppsOutputSchema = z.record(z.string(), z.string()).describe('A map of application names to categories.');
export type CategorizeAppsOutput = z.infer<typeof CategorizeAppsOutputSchema>;

export async function categorizeApps(input: CategorizeAppsInput): Promise<CategorizeAppsOutput> {
  return categorizeAppsFlow(input);
}

const categorizeAppsPrompt = ai.definePrompt({
  name: 'categorizeAppsPrompt',
  input: {schema: CategorizeAppsInputSchema},
  output: {schema: CategorizeAppsOutputSchema},
  prompt: `You are an expert app classifier. Given a list of app names, you will classify each app into one of the following categories: Social, Media, Games, Productivity, Utilities, or Other.

  Return a JSON object where the keys are the app names and the values are the categories.

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
