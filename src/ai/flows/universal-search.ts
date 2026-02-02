'use server';

/**
 * @fileOverview Provides universal search capabilities across apps, contacts, and the web.
 *
 * - `universalSearch` - A function that returns a list of categorized search results.
 */

import {ai} from '@/ai/genkit';
import {
  UniversalSearchInput,
  UniversalSearchInputSchema,
  UniversalSearchOutput,
  UniversalSearchOutputSchema,
} from '@/ai/types';

export async function universalSearch(input: UniversalSearchInput): Promise<UniversalSearchOutput> {
  return universalSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'universalSearchPrompt',
  input: {schema: UniversalSearchInputSchema},
  output: {schema: UniversalSearchOutputSchema},
  prompt: `You are a powerful search assistant integrated into a mobile phone launcher. Your task is to provide relevant results for a user's query from their installed apps, contacts, and the web.

  Here is the user's query: "{{query}}"

  Here are the available data sources:
  - Installed Apps: {{#each installedApps}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}
  - Contacts: {{#each contacts}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}

  Your job is to:
  1.  Analyze the user's query: "{{query}}".
  2.  Find any matching apps from the "Installed Apps" list. For these results, set \`type\` to "app".
  3.  Find any matching contacts from the "Contacts" list. For these results, set \`type\` to "contact" and \`icon\` to "UserCircle2".
  4.  If the query seems like a general question or something to search online, generate 2-3 relevant "web" search suggestions. For these results, set \`type\` to "web", \`icon\` to "Globe", and provide a short, helpful \`description\`.
  5.  Combine all these results into a single list. Prioritize exact matches for apps and contacts. If there are no clear app or contact matches, provide only web suggestions.

  Return a JSON object with a "results" array. Each item in the array must be an object with "type", "title", and "icon".
  For "app" results, you do not need to provide an icon; it will be added later by the system.
  `,
});

const universalSearchFlow = ai.defineFlow(
  {
    name: 'universalSearchFlow',
    inputSchema: UniversalSearchInputSchema,
    outputSchema: UniversalSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { results: [] };
    }

    // Post-process to add correct icons for apps
    const { INSTALLED_APPS } = require('@/lib/apps');
    
    const appMap = new Map(INSTALLED_APPS.map((app: any) => [app.name, app.icon]));

    output.results.forEach(result => {
      if (result.type === 'app' && appMap.has(result.title)) {
        result.icon = appMap.get(result.title)!;
      }
    });

    return output;
  }
);
