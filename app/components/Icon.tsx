import {
  Backpack, Building2, Bug, CalendarDays, Car, CheckCircle2, ClipboardCheck,
  CloudRainWind, Droplets, FileText, House, KeyRound, Landmark, Map, MapPinned,
  PackageOpen, Palmtree, PawPrint, PlugZap, ReceiptText, Shield, ShieldCheck,
  Sparkles, Sun, Umbrella, Waves, Wifi, Wrench, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Backpack, Building2, Bug, CalendarDays, Car, CheckCircle2, ClipboardCheck,
  CloudRainWind, Droplets, FileText, House, KeyRound, Landmark, Map, MapPinned,
  PackageOpen, Palmtree, PawPrint, PlugZap, ReceiptText, Shield, ShieldCheck,
  Sparkles, Sun, Umbrella, Waves, Wifi, Wrench,
};

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const Component = icons[name] ?? CheckCircle2;
  return <Component size={size} strokeWidth={1.8} aria-hidden="true" />;
}
