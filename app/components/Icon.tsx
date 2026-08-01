import { BadgeCheck, BookOpen, Building2, Bus, Car, CloudSun, Droplets, ExternalLink, Flame, GraduationCap, House, Info, Landmark, Mail, MapPin, Recycle, ShieldAlert, ShieldCheck, Vote, Wifi, Zap, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = { BadgeCheck, BookOpen, Building2, Bus, Car, CloudSun, Droplets, ExternalLink, Flame, GraduationCap, House, Info, Landmark, Mail, MapPin, Recycle, ShieldAlert, ShieldCheck, Vote, Wifi, Zap };

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const Component = icons[name] ?? Info;
  return <Component size={size} strokeWidth={1.9} aria-hidden="true" />;
}
