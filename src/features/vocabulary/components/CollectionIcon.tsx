import {
  Briefcase,
  CircleAlert,
  Code,
  Coffee,
  Flame,
  Folder,
  Plane,
  Shuffle,
  Sparkles,
  UserCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/** Collections store an icon *name*; only this small set is bundled. */
const ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  'circle-alert': CircleAlert,
  code: Code,
  coffee: Coffee,
  flame: Flame,
  folder: Folder,
  plane: Plane,
  shuffle: Shuffle,
  sparkles: Sparkles,
  'user-check': UserCheck,
  zap: Zap,
}

export function CollectionIcon({ name }: { name?: string }) {
  const Icon = (name && ICONS[name]) || Folder
  return <Icon aria-hidden />
}
