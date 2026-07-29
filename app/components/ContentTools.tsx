import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Guide, OfficialResource } from "../data/guides";
import { guidesByPath } from "../data/guides";

export function ReviewedDate({ published, reviewed }: { published?: string; reviewed: string }) {
  return <p className="content-dates">{published ? <span>Published {formatDate(published)}</span> : null}<span>Last reviewed {formatDate(reviewed)}</span></p>;
}

export function OfficialResources({ resources }: { resources: OfficialResource[] }) {
  if (!resources.length) return null;
  return <section className="official-resource-section"><div className="section-heading compact"><span className="eyebrow">Official resources</span><h2>Confirm details at the source.</h2></div><div className="official-resource-list">{resources.map((resource) => <article className="official-resource" key={resource.url}><ShieldCheck size={20} aria-hidden="true" /><div><h3>{resource.title}</h3><p><strong>{resource.organization}</strong> · Checked {formatDate(resource.checked)}</p><p>{resource.note}</p><a href={resource.url} target="_blank" rel="noopener noreferrer">Visit {resource.organization} <ExternalLink size={15} aria-hidden="true" /></a></div></article>)}</div></section>;
}

export function RelatedGuides({ paths, title = "Related guides" }: { paths: string[]; title?: string }) {
  const related = paths.map((path) => guidesByPath.get(path)).filter((guide): guide is Guide => Boolean(guide));
  if (!related.length) return null;
  return <section className="related-guides"><div className="section-heading compact"><span className="eyebrow">Keep going</span><h2>{title}</h2></div><div className="related-guide-grid">{related.map((guide) => <Link href={guide.path} key={guide.path} data-analytics-event="related_guide_click"><span>{guide.eyebrow}</span><strong>{guide.h1}</strong><small>Read the guide <ArrowRight size={14} aria-hidden="true" /></small></Link>)}</div></section>;
}

export function NextStep({ href = "/#zip-lookup", label = "Find services for your ZIP code" }: { href?: string; label?: string }) {
  return <aside className="next-step"><div><span className="eyebrow">Next step</span><h2>Use official information for your address.</h2><p>Start with the ZIP lookup, then confirm every provider directly before opening or transferring service.</p></div><Link className="button" href={href}>{label} <ArrowRight size={17} aria-hidden="true" /></Link></aside>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
