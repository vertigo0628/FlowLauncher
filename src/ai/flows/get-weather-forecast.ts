'use server';
/**
 * @fileOverview Provides a weather forecast.
 *
 * - getWeatherForecast - A function that returns a weather forecast.
 */

import {ai} from '@/ai/genkit';
import {
  WeatherForecastInput,
  WeatherForecastInputSchema,
  WeatherForecastOutput,
  WeatherForecastOutputSchema,
} from '@/ai/types';

export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return weatherForecastFlow(input);
}

const weatherForecastFlow = ai.defineFlow(
  {
    name: 'weatherForecastFlow',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async (input) => {
    // In a real app, you would fetch this from a weather API.
    // For this example, we'll return a mock forecast.
    return {
      temperature: 24,
      condition: 'Sunny',
      location: input.location,
      icon: 'Sun',
    };
  }
);
