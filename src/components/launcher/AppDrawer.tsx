'use client';
import { useState } from 'react';
import type { App } from '@/lib/types';
import AppIcon from './AppIcon';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppDrawer({
  isOpen,
  onClose,
  allApps,
}: {
  isOpen: boolean;
  onClose: () => void;
  allApps: App[];
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-xl z-30 flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 h-8" onClick={onClose} />
      <div className="flex-grow overflow-y-auto p-4 pt-10">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 gap-y-6">
          {filteredApps.map((app) => (
            <AppIcon key={app.name} app={app} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
