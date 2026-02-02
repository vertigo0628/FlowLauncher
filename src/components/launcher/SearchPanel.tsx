'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="absolute inset-x-0 top-0 h-48 bg-background/80 backdrop-blur-xl z-30 p-4 pt-12"
    >
      <div className="absolute bottom-0 left-0 right-0 h-8" onClick={onClose} />
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10 text-lg h-12" autoFocus />
      </div>
    </motion.div>
  );
}
