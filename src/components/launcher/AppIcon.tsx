import type { App } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type AppIconProps = {
  app: App;
  showName?: boolean;
  className?: string;
};

export default function AppIcon({ app, showName = true, className }: AppIconProps) {
  const Icon = app.icon;
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      className={cn("flex flex-col items-center gap-1.5 text-center w-20 cursor-pointer", className)}
    >
      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <Icon className="w-8 h-8 text-secondary-foreground" />
      </div>
      {showName && (
        <p className="text-xs text-foreground truncate w-full">{app.name}</p>
      )}
    </motion.div>
  );
}
