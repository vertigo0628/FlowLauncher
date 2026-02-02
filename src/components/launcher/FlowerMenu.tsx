'use client';

import { useState } from 'react';
import { Plus, X, Users, Clapperboard, Gamepad2, FileText, Wrench, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import type { App, CategorizedApps } from '@/lib/types';
import type { Icon } from '@/lib/utils';
import AppIcon from './AppIcon';

const categoryIconMap: { [key: string]: Icon } = {
  Social: Users,
  Media: Clapperboard,
  Games: Gamepad2,
  Productivity: FileText,
  Utilities: Wrench,
  Other: Box,
};

export default function FlowerMenu({
  categorizedApps,
  allApps,
}: {
  categorizedApps: CategorizedApps;
  allApps: App[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(Object.values(categorizedApps))];
  const radius = 6.5; // in rem

  const appsForCategory = selectedCategory
    ? allApps.filter((app) => categorizedApps[app.name] === selectedCategory)
    : [];
  
  const CategoryIcon = selectedCategory ? categoryIconMap[selectedCategory] || Box : Box;

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center" style={{height: '4rem'}}>
        {categories.map((category, index) => {
          const angle = (index / categories.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const Icon = categoryIconMap[category] || Box;

          return (
            <motion.div
              key={category}
              className="absolute"
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={isOpen ? { scale: 1, opacity: 1, x: `${x}rem`, y: `${y}rem` } : { scale: 0, opacity: 0, x: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: isOpen ? index * 0.05 : 0 }}
            >
              <Button
                size="icon"
                className="w-12 h-12 rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsOpen(false);
                }}
              >
                <Icon className="w-6 h-6" />
              </Button>
            </motion.div>
          );
        })}

        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg z-20 bg-primary text-primary-foreground hover:bg-primary/90 transform transition-transform duration-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle app categories"
        >
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
            <Plus className="w-8 h-8" />
          </motion.div>
        </Button>
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <CategoryIcon className="w-5 h-5" />
                {selectedCategory}
            </DialogTitle>
            <DialogDescription>
                Apps in the {selectedCategory} category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-4">
            {appsForCategory.map((app) => (
              <AppIcon key={app.name} app={app} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
