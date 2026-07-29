import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "../lib/metadata";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, ...(item.href ? { item: new URL(item.href, SITE_URL).toString() } : {}) })) };
  return <><JsonLd data={schema} /><nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 ? <ChevronRight size={14} aria-hidden="true" /> : null}</span>)}</nav></>;
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: React.ReactNode }) {
  return <section className="page-hero"><div className="shell">{eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}<h1>{title}</h1><p>{description}</p>{children}</div></section>;
}
