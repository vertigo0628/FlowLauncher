'use client';
import { useState, useRef } from 'react';
import type { App, CategorizedApps } from '@/lib/types';
import type { WeatherForecastOutput } from '@/ai/flows/get-weather-forecast';
import AppSuggestions from './AppSuggestions';
import FlowerMenu from './FlowerMenu';
import AppDrawer from './AppDrawer';
import SearchPanel from './SearchPanel';
import ClockWidget from './ClockWidget';
import WeatherWidget from './WeatherWidget';
import AppIcon from './AppIcon';
import { AnimatePresence } from 'framer-motion';

export default function HomeScreen({
  categorizedApps,
  allApps,
  dockApps,
  weatherForecast,
}: {
  categorizedApps: CategorizedApps;
  allApps: App[];
  dockApps: App[];
  weatherForecast: WeatherForecastOutput | null;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const MIN_SWIPE_DISTANCE = 50;

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
      }
    }
    // Reset refs
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  return (
    <div
      className="relative h-full w-full flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ClockWidget />
      <WeatherWidget forecast={weatherForecast} isLoading={!weatherForecast} />
      <div className="flex-grow flex flex-col justify-center">
        <AppSuggestions />
      </div>

      <footer className="pb-8">
        <div className="flex justify-center items-center gap-4 px-6 h-20 bg-background/50 backdrop-blur-sm">
          {dockApps.map((app) => (
            <AppIcon key={app.name} app={app} showName={false} />
          ))}
        </div>
        <FlowerMenu categorizedApps={categorizedApps} allApps={allApps} />
      </footer>

      <AnimatePresence>
        {drawerOpen && <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} allApps={allApps} />}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen && <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
