'use client';

import * as LucideIcons from 'lucide-react';
import type { WeatherForecastOutput } from '@/ai/flows/get-weather-forecast';
import { Skeleton } from '@/components/ui/skeleton';

type WeatherWidgetProps = {
  forecast: WeatherForecastOutput | null;
  isLoading: boolean;
};

export default function WeatherWidget({ forecast, isLoading }: WeatherWidgetProps) {
  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (!forecast) {
    return null;
  }

  const Icon = (LucideIcons as any)[forecast.icon] || LucideIcons.CloudQuestion;

  return (
    <div className="flex flex-col items-center justify-center text-center -mt-4 mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-8 h-8 text-foreground" />
        <p className="text-5xl font-bold tracking-tight text-foreground">
          {forecast.temperature}°
        </p>
      </div>
      <p className="text-md text-muted-foreground">{forecast.condition} in {forecast.location}</p>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center text-center -mt-4 mb-4">
        <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-16 h-12" />
        </div>
        <Skeleton className="w-32 h-6 mt-1" />
    </div>
  )
}
