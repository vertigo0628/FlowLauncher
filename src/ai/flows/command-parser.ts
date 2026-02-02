'use server';

/**
 * @fileOverview Parses a user's voice command to determine intent and entities.
 *
 * - parseCommand - A function that parses a user's command.
 */

import {ai} from '@/ai/genkit';
import {
  CommandParserInput,
  CommandParserInputSchema,
  CommandParserOutput,
  CommandParserOutputSchema,
} from '@/ai/types';

export async function parseCommand(input: CommandParserInput): Promise<CommandParserOutput> {
  return commandParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'commandParserPrompt',
  input: {schema: CommandParserInputSchema},
  output: {schema: CommandParserOutputSchema},
  prompt: `You are the AI brain for a mobile phone launcher. Your job is to parse the user's command and determine their intent.

  Here is the user's command: "{{command}}"

  Here are the apps the user has installed:
  {{#each installedApps}}
  - "{{this}}"
  {{/each}}

  Analyze the user's command and respond with the appropriate intent and any relevant entities.

  Available Intents:
  - 'launch_app': When the user wants to open an application. The 'appName' entity should be one of the installed apps.
  - 'search': When the user wants to search for something on the web, their contacts, or apps. The 'searchQuery' entity should be what they are looking for.
  - 'open_drawer': When the user wants to see all their apps.
  - 'show_suggestions': When the user asks for app suggestions.
  - 'unrecognized': If the command is unclear or cannot be handled.

  Examples:
  - Command: "Open Messages" -> Intent: 'launch_app', appName: 'Messages', response: "Opening Messages."
  - Command: "Launch the calendar app" -> Intent: 'launch_app', appName: 'Calendar', response: "Launching Calendar."
  - Command: "Search for pictures of cats" -> Intent: 'search', searchQuery: 'pictures of cats', response: "Searching for pictures of cats."
  - Command: "Show me all my apps" -> Intent: 'open_drawer', response: "Here are all of your apps."
  - Command: "What should I do now?" -> Intent: 'show_suggestions', response: "Here are some apps you might like."
  - Command: "what time is it" -> Intent: 'unrecognized', response: "Sorry, I can't check the time yet."
  
  If you recognize an app, make sure the appName entity EXACTLY matches one from the provided list. If it's a close match, use the correct name from the list.
  
  Provide a friendly, natural language response that confirms the action.
  `,
});

const commandParserFlow = ai.defineFlow(
  {
    name: 'commandParserFlow',
    inputSchema: CommandParserInputSchema,
    outputSchema: CommandParserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
