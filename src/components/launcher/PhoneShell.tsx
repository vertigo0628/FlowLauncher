'use client';
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import { eventBus } from '@/lib/event-bus';

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('flow-launcher-theme') || 'light';
    setTheme(savedTheme);

    eventBus.on('toggleTheme', toggleTheme);

    return () => {
      eventBus.off('toggleTheme', toggleTheme);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('flow-launcher-theme', theme);
  }, [theme]);


  return (
    <div className="relative w-full max-w-[420px] aspect-[9/19] bg-white dark:bg-black rounded-[40px] shadow-2xl border-4 border-gray-800 dark:border-gray-600 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-8 bg-gray-800 dark:bg-gray-600 flex justify-center items-end rounded-t-[36px] z-20">
        <div className="w-40 h-6 bg-black rounded-b-xl border-x-4 border-b-4 border-gray-800 dark:border-gray-600"></div>
      </div>
      <div className={cn("h-full w-full bg-background text-foreground transition-colors duration-300", "pt-8")}>
        <div className="absolute top-2 right-2 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        {children}
      </div>
      <Toaster />
    </div>
  );
}
