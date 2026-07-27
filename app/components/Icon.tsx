import { Building2, Droplets, Flame, House, Info, Landmark, MapPin, Recycle, ShieldCheck, Wifi, Zap, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = { Building2, Droplets, Flame, House, Info, Landmark, MapPin, Recycle, ShieldCheck, Wifi, Zap };

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const Component = icons[name] ?? Info;
  return <Component size={size} strokeWidth={1.9} aria-hidden="true" />;
}
