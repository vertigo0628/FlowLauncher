'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import type { App } from '@/lib/types';
import AppIcon from './AppIcon';

export default function SearchPanel({
  isOpen,
  onClose,
  allApps,
}: {
  isOpen: boolean;
  onClose: () => void;
  allApps: App[];
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = searchTerm
    ? allApps.filter((app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="absolute inset-0 bg-background/80 backdrop-blur-xl z-30 flex flex-col"
    >
      <div className="absolute inset-x-0 bottom-0 top-48" onClick={onClose} />
      <div className="p-4 pt-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            className="pl-10 text-lg h-12"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {searchTerm && (
        <div className="flex-grow overflow-y-auto px-4 pb-4">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 gap-y-6">
              {filteredApps.map((app) => (
                <AppIcon key={app.name} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
