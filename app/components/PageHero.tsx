import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Icon } from "./Icon";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 && <ChevronRight size={13} aria-hidden="true" />}</span>)}</nav>;
}

export function PageHero({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <section className="page-hero"><div className="shell"><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p>{children}</div></section>;
}

export function ContentCard({ title, description, href, icon }: { title: string; description?: string; href?: string; icon?: string }) {
  const content = <>{icon && <span className="content-card-icon"><Icon name={icon} size={24} /></span>}<h3>{title}</h3>{description && <p>{description}</p>}{href && <span className="content-card-link">Open guide <ArrowRight size={16} aria-hidden="true" /></span>}</>;
  return href ? <Link href={href} className="content-card">{content}</Link> : <article className="content-card">{content}</article>;
}
