'use client';

import { useEffect, useState } from 'react';
import { getDailyBriefing } from '@/app/actions';
import type { DailyBriefingOutput } from '@/ai/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

export default function BriefingWidget() {
  const [briefing, setBriefing] = useState<DailyBriefingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      setIsLoading(true);
      try {
        const result = await getDailyBriefing();
        setBriefing(result);
      } catch (error) {
        console.error('Failed to get daily briefing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBriefing();
  }, []);

  if (isLoading) {
    return <BriefingSkeleton />;
  }

  if (!briefing) {
    return null;
  }

  return (
    <Card className="mx-4 my-2 bg-background/50 border-0 shadow-none">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>{briefing.greeting}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-2 text-muted-foreground">
        <p>{briefing.weatherSummary}</p>
        <p>{briefing.calendarHighlight}</p>
        <p>{briefing.appSuggestion}</p>
      </CardContent>
    </Card>
  );
}

function BriefingSkeleton() {
    return (
        <Card className="mx-4 my-2 bg-transparent border-0 shadow-none">
            <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <Skeleton className="h-6 w-32" />
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </CardContent>
        </Card>
    )
}
