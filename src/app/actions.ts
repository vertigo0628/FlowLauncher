'use server';

import { categorizeApps as categorizeAppsFlow } from '@/ai/flows/auto-app-categorization';
import { getAppSuggestions as getAppSuggestionsFlow } from '@/ai/flows/intelligent-app-suggestions';
import { getWeatherForecast as getWeatherForecastFlow } from '@/ai/flows/get-weather-forecast';
import { getDailyBriefing as getDailyBriefingFlow } from '@/ai/flows/daily-briefing';
import { universalSearch as universalSearchFlow } from '@/ai/flows/universal-search';
import { parseCommand as parseCommandFlow } from '@/ai/flows/command-parser';
import type {
  CategorizeAppsInput,
  CategorizeAppsOutput,
  AppSuggestionsInput,
  AppSuggestionsOutput,
  WeatherForecastInput,
  WeatherForecastOutput,
  DailyBriefingOutput,
  UniversalSearchInput,
  UniversalSearchOutput,
  CommandParserInput,
  CommandParserOutput,
} from '@/ai/types';

export async function categorizeApps(input: CategorizeAppsInput): Promise<CategorizeAppsOutput> {
  return await categorizeAppsFlow(input);
}

export async function getAppSuggestions(input: AppSuggestionsInput): Promise<AppSuggestionsOutput> {
  return await getAppSuggestionsFlow(input);
}

export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return await getWeatherForecastFlow(input);
}

export async function getDailyBriefing(): Promise<DailyBriefingOutput> {
  return await getDailyBriefingFlow();
}

export async function universalSearch(input: UniversalSearchInput): Promise<UniversalSearchOutput> {
  return await universalSearchFlow(input);
}

export async function parseCommand(input: CommandParserInput): Promise<CommandParserOutput> {
  return await parseCommandFlow(input);
}
