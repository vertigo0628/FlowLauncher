'use client';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { App } from '@/lib/types';
import { universalSearch } from '@/app/actions';
import { INSTALLED_APPS } from '@/lib/apps';
import { MOCK_CONTACTS } from '@/lib/contacts';
import { Skeleton } from '@/components/ui/skeleton';
import AppIcon from './AppIcon';
import * as LucideIcons from 'lucide-react';
import type { UniversalSearchOutput, SearchResultItem } from '@/ai/types';

function SearchResultDisplay({ item }: { item: SearchResultItem }) {
    const IconComponent = (LucideIcons as any)[item.icon] || Globe;
    return (
        <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary w-full cursor-pointer">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex-grow">
                <p className="font-medium text-foreground">{item.title}</p>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
            </div>
        </div>
    );
}


export default function SearchPanel({
  isOpen,
  onClose,
  allApps,
  initialQuery = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  allApps: App[];
  initialQuery?: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<UniversalSearchOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query) {
        setResults(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const res = await universalSearch({
          query,
          installedApps: INSTALLED_APPS.map(app => app.name),
          contacts: MOCK_CONTACTS.map(contact => contact.name),
        });
        setResults(res);
      } catch (error) {
        console.error("Search failed:", error);
        setResults({ results: [] });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, handleSearch]);
  
  const groupedResults = (results?.results || []).reduce((acc, result) => {
    const type = result.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(result);
    return acc;
  }, {} as Record<string, SearchResultItem[]>);

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
            placeholder="Search apps, contacts, and web..."
            className="pl-10 text-lg h-12"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
        <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
              ))}
            </div>
          )}
          {!isLoading && searchTerm && (
            <>
              {groupedResults.app && groupedResults.app.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Apps</h3>
                  <div className="grid grid-cols-4 gap-y-6">
                    {groupedResults.app.map((item) => {
                       const app = allApps.find(a => a.name === item.title);
                       return app ? <AppIcon key={item.title} app={app} /> : null;
                    })}
                  </div>
                </div>
              )}
               {groupedResults.contact && groupedResults.contact.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Contacts</h3>
                  <div className="space-y-1">
                    {groupedResults.contact.map((item) => <SearchResultDisplay key={item.title} item={item} />)}
                  </div>
                </div>
              )}
               {groupedResults.web && groupedResults.web.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Web Search</h3>
                   <div className="space-y-1">
                    {groupedResults.web.map((item) => <SearchResultDisplay key={item.title} item={item} />)}
                   </div>
                </div>
              )}
              {results && results.results.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                    <p>No results for "{searchTerm}"</p>
                 </div>
              )}
            </>
          )}
        </div>
    </motion.div>
  );
}
