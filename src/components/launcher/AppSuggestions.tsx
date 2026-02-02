'use client';
import { useState, useEffect } from 'react';
import { getAppSuggestions } from '@/app/actions';
import { INSTALLED_APPS } from '@/lib/apps';
import type { App } from '@/lib/types';
import AppIcon from './AppIcon';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppSuggestions() {
  const [suggestions, setSuggestions] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      const now = new Date();
      const hours = now.getHours();
      let timeOfDay = 'night';
      if (hours >= 5 && hours < 12) timeOfDay = 'morning';
      else if (hours >= 12 && hours < 17) timeOfDay = 'afternoon';
      else if (hours >= 17 && hours < 21) timeOfDay = 'evening';

      try {
        const result = await getAppSuggestions({
          timeOfDay,
          location: 'Home',
          usagePatterns: 'Frequently uses productivity and media apps.',
          installedApps: INSTALLED_APPS.map(app => app.name),
        });

        const suggestedApps = INSTALLED_APPS.filter(app => result.suggestedApps.includes(app.name));
        setSuggestions(suggestedApps.slice(0, 5));
      } catch (error) {
        console.error("Failed to get app suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="p-4 h-48 flex flex-col">
      <h2 className="text-sm font-medium text-muted-foreground mb-3 px-2">Suggestions</h2>
      <div className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <div className="flex gap-4 justify-center w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 w-20">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="w-12 h-4 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 justify-center w-full">
            {suggestions.length > 0 ? (
                suggestions.map(app => <AppIcon key={app.name} app={app} />)
            ) : (
                <p className="text-sm text-muted-foreground">No suggestions right now.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
