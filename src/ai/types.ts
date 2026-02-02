import { z } from 'genkit';

// from auto-app-categorization.ts
export const CategorizeAppsInputSchema = z.object({
  appNames: z.array(z.string()).describe('A list of application names to categorize.'),
});
export type CategorizeAppsInput = z.infer<typeof CategorizeAppsInputSchema>;

export const AppCategoryPairSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  category: z.string().describe('The category of the application (Social, Media, Games, Productivity, Utilities, or Other).'),
});

export const CategorizeAppsOutputSchema = z.object({
  categorizations: z.array(AppCategoryPairSchema).describe('A list of app names and their corresponding categories.'),
});
export type CategorizeAppsOutput = z.infer<typeof CategorizeAppsOutputSchema>;


// from daily-briefing.ts
export const DailyBriefingOutputSchema = z.object({
    greeting: z.string().describe("A friendly greeting based on the time of day."),
    weatherSummary: z.string().describe("A concise summary of the weather forecast."),
    calendarHighlight: z.string().describe("A highlight of an upcoming calendar event. States 'No upcoming events today.' if none."),
    appSuggestion: z.string().describe("A suggestion for an app to use, with a brief reason."),
});
export type DailyBriefingOutput = z.infer<typeof DailyBriefingOutputSchema>;


// from get-weather-forecast.ts
export const WeatherForecastInputSchema = z.object({
  location: z.string().describe('The location for which to get the weather forecast.'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

export const WeatherForecastOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy").'),
  location: z.string().describe('The location for the forecast.'),
  icon: z.string().describe('A lucide-react icon name representing the weather condition (e.g., "Sun", "Cloudy").'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;

// from intelligent-app-suggestions.ts
export const AppSuggestionsInputSchema = z.object({
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  location: z.string().describe('The user\u0027s current location (e.g., home, work, commuting).'),
  usagePatterns: z.string().describe('A description of the user\u0027s recent app usage patterns.'),
  installedApps: z.array(z.string()).describe('A list of the names of the apps installed on the device.'),
});
export type AppSuggestionsInput = z.infer<typeof AppSuggestionsInputSchema>;

export const AppSuggestionsOutputSchema = z.object({
  suggestedApps: z.array(z.string()).describe('A list of app names suggested for the user based on their current context.'),
});
export type AppSuggestionsOutput = z.infer<typeof AppSuggestionsOutputSchema>;

// from universal-search.ts
export const UniversalSearchInputSchema = z.object({
    query: z.string().describe('The user\'s search query.'),
    installedApps: z.array(z.string()).describe('A list of the names of the apps installed on the device.'),
    contacts: z.array(z.string()).describe('A list of the names of the user\'s contacts.'),
});
export type UniversalSearchInput = z.infer<typeof UniversalSearchInputSchema>;

export const SearchResultItemSchema = z.object({
    type: z.enum(['app', 'contact', 'web']).describe('The type of search result.'),
    title: z.string().describe('The main title of the search result.'),
    icon: z.string().describe('A lucide-react icon name for the result.'),
    description: z.string().optional().describe('A short description or subtext for the result.'),
});
export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;

export const UniversalSearchOutputSchema = z.object({
    results: z.array(SearchResultItemSchema).describe('A list of search results.'),
});
export type UniversalSearchOutput = z.infer<typeof UniversalSearchOutputSchema>;
