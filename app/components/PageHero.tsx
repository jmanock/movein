import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 ? <ChevronRight size={14} aria-hidden="true" /> : null}</span>)}</nav>;
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: React.ReactNode }) {
  return <section className="page-hero"><div className="shell">{eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}<h1>{title}</h1><p>{description}</p>{children}</div></section>;
}
