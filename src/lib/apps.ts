import type { App } from '@/lib/types';

export const INSTALLED_APPS: App[] = [
  { name: 'Messages', icon: 'MessageCircle' },
  { name: 'Contacts', icon: 'Users' },
  { name: 'YouTube', icon: 'Youtube' },
  { name: 'Movies', icon: 'Film' },
  { name: 'Music', icon: 'Music' },
  { name: 'Chess', icon: 'Gamepad2' },
  { name: 'Dice', icon: 'Dices' },
  { name: 'Notes', icon: 'FileText' },
  { name: 'Calendar', icon: 'Calendar' },
  { name: 'Mail', icon: 'Mail' },
  { name: 'Calculator', icon: 'Calculator' },
  { name: 'Clock', icon: 'Clock' },
  { name: 'Settings', icon: 'Settings' },
  { name: 'Camera', icon: 'Camera' },
  { name: 'Maps', icon: 'Map' },
  { name: 'Authenticator', icon: 'Shield' },
  { name: 'Store', icon: 'ShoppingBag' },
  { name: 'Office', icon: 'Briefcase' },
  { name: 'Reader', icon: 'Book' },
  { name: 'Wallet', icon: 'Wallet' },
  { name: 'Cloud', icon: 'Cloud' },
  { name: 'Tools', icon: 'Wrench' },
  { name: 'Files', icon: 'Package' },
];

export const ALL_APPS_SORTED: App[] = [...INSTALLED_APPS].sort((a, b) =>
  a.name.localeCompare(b.name)
);
