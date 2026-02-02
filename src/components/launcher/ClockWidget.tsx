'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="text-center pt-24 pb-8">
      <div className="text-7xl font-bold tracking-tighter text-foreground relative h-20 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={timeString}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute"
          >
            {timeString}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="text-lg text-muted-foreground">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}
