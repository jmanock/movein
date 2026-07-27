"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export const MONETIZATION_ENABLED = false;

type RecommendationProps = { type: "product" | "service" | "sponsored" | "partner"; title: string; description: string; href: string; affiliate?: boolean };

export function Recommendation({ type, title, description, href, affiliate = false }: RecommendationProps) {
  if (!MONETIZATION_ENABLED) return null;
  return <aside className="recommendation"><span>{type === "sponsored" ? "Sponsored placement" : type === "partner" ? "Local partner" : `Recommended ${type}`}</span><h3>{title}</h3><p>{description}</p><a href={href} rel={affiliate ? "nofollow sponsored" : "nofollow"} onClick={() => trackEvent(affiliate ? "affiliate_link_click" : "outbound_resource_click", { label: title })}>Visit resource <ExternalLink size={15} /></a>{affiliate && <small>MoveIn may earn a commission from qualifying links, at no added cost to you.</small>}</aside>;
}
