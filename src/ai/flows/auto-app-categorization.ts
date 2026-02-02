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

const AppCategoryPairSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  category: z.string().describe('The category of the application (Social, Media, Games, Productivity, Utilities, or Other).'),
});

const CategorizeAppsOutputSchema = z.object({
  categorizations: z.array(AppCategoryPairSchema).describe('A list of app names and their corresponding categories.'),
});
export type CategorizeAppsOutput = z.infer<typeof CategorizeAppsOutputSchema>;

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
