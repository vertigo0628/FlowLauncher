'use server';
/**
 * @fileOverview Provides a weather forecast.
 *
 * - getWeatherForecast - A function that returns a weather forecast.
 * - WeatherForecastInput - The input type for the getWeatherForecast function.
 * - WeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherForecastInputSchema = z.object({
  location: z.string().describe('The location for which to get the weather forecast.'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const WeatherForecastOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('A brief description of the weather condition (e.g., "Sunny", "Cloudy").'),
  location: z.string().describe('The location for the forecast.'),
  icon: z.string().describe('A lucide-react icon name representing the weather condition (e.g., "Sun", "Cloudy").'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;

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
