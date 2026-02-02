'use client';
import { useState, useRef } from 'react';
import type { App, CategorizedApps } from '@/lib/types';
import type { WeatherForecastOutput } from '@/ai/types';
import BriefingWidget from './BriefingWidget';
import VoiceAssistantWidget from './VoiceAssistantWidget';
import AppDrawer from './AppDrawer';
import SearchPanel from './SearchPanel';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';
import FlowerMenu from './FlowerMenu';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { eventBus } from '@/lib/event-bus';
import AppSuggestions from './AppSuggestions';

export default function HomeScreen({
  categorizedApps,
  allApps,
  weatherForecast,
}: {
  categorizedApps: CategorizedApps;
  allApps: App[];
  weatherForecast: WeatherForecastOutput | null;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const MIN_SWIPE_DISTANCE = 50;
  const { toast } = useToast();

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === 0 || touchEndY.current === 0) return;
    
    const deltaY = touchStartY.current - touchEndY.current;

    if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
      if (deltaY > 0) {
        // Swipe Up
        setDrawerOpen(true);
      } else {
        // Swipe Down
        setSearchOpen(true);
        setSearchQuery('');
      }
    }
    // Reset refs
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const handleAssistantCommand = (intent: string, entities: any) => {
    switch (intent) {
      case 'launch_app':
        toast({
            title: 'Launching App',
            description: `Opening ${entities.appName}`,
        });
        break;
      case 'search':
        setSearchQuery(entities.searchQuery || '');
        setSearchOpen(true);
        break;
      case 'open_drawer':
        setDrawerOpen(true);
        break;
      case 'show_suggestions':
        // This could be enhanced to scroll to the suggestions widget
        document.getElementById('suggestions')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'toggle_setting':
        if (entities.settingName?.includes('dark') || entities.settingName?.includes('light')) {
            eventBus.emit('toggleTheme');
        }
        break;
      case 'get_briefing':
        // The assistant's verbal response is handled in VoiceAssistantWidget.
        // We can optionally highlight the briefing widget here.
        const briefingWidget = document.getElementById('briefing-widget');
        if (briefingWidget) {
            briefingWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            briefingWidget.classList.add('animate-pulse');
            setTimeout(() => {
                briefingWidget.classList.remove('animate-pulse');
            }, 2000);
        }
        break;
      default:
        break;
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      className="relative h-full w-full flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-shrink-0">
        <ClockWidget />
        <WeatherWidget forecast={weatherForecast} isLoading={!weatherForecast} />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-4">
        <div id="briefing-widget">
          <BriefingWidget />
        </div>
        <div id="suggestions">
          <AppSuggestions />
        </div>
      </div>

      <footer className="pb-8 pt-2 flex-shrink-0">
        <div className="flex justify-center items-center px-6 h-20">
            <FlowerMenu categorizedApps={categorizedApps} allApps={allApps} />
        </div>
        <div className="mt-4">
            <VoiceAssistantWidget onCommand={handleAssistantCommand} />
        </div>
      </footer>

      <AnimatePresence>
        {drawerOpen && <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} allApps={allApps} />}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen && <SearchPanel isOpen={searchOpen} onClose={handleSearchClose} allApps={allApps} initialQuery={searchQuery} />}
      </AnimatePresence>
    </div>
  );
}
