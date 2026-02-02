import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { LucideIcon as Icon } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type { Icon }
