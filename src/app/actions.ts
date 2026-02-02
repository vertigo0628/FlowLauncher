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

export async function categorizeApps(input: CategorizeAppsInput): Promise<CategorizeAppsOutput> {
  return await categorizeAppsFlow(input);
}

export async function getAppSuggestions(input: AppSuggestionsInput): Promise<AppSuggestionsOutput> {
  return await getAppSuggestionsFlow(input);
}
