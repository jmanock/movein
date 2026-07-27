"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "../lib/analytics";

export function OfficialResource({ href, label }: { href: string; label: string }) {
  return <a className="official-link" href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("outbound_official_resource_click", { destination_host: new URL(href).hostname, label })}>{label}<ExternalLink size={16} aria-hidden="true" /></a>;
}

export function RelatedGuideLink({ href, label }: { href: string; label: string }) {
  return <Link href={href} onClick={() => trackEvent("related_guide_click", { path: href })}>{label}</Link>;
}
