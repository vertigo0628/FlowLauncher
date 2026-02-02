import type { LucideIcon } from 'lucide-react';

export type App = {
  name: string;
  icon: LucideIcon;
};

export type CategorizedApps = {
  [appName: string]: string;
};
