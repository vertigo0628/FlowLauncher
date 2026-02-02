// src/app/actions.ts
'use server';

import {
  categorizeApps as categorizeAppsFlow,
  type CategorizeAppsInput,
  type CategorizeAppsOutput,
} from '@/ai/flows/auto-app-categorization';

import {
  getAppSuggestions as getAppSuggestionsFlow,
  type AppSuggestionsInput,
  type AppSuggestionsOutput,
} from '@/ai/flows/intelligent-app-suggestions';

import {
  getWeatherForecast as getWeatherForecastFlow,
  type WeatherForecastInput,
  type WeatherForecastOutput,
} from '@/ai/flows/get-weather-forecast';

export async function categorizeApps(input: CategorizeAppsInput): Promise<CategorizeAppsOutput> {
  return await categorizeAppsFlow(input);
}

export async function getAppSuggestions(input: AppSuggestionsInput): Promise<AppSuggestionsOutput> {
  return await getAppSuggestionsFlow(input);
}

export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return await getWeatherForecastFlow(input);
}
