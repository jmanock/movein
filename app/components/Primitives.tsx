import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

export function SectionIntro({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: { href: string; label: string } }) {
  return <div className="section-intro"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text ? <p>{text}</p> : null}</div>{action ? <Link href={action.href}>{action.label}<ArrowRight size={16} aria-hidden="true" /></Link> : null}</div>;
}

export function TrustStrip() {
  return <aside className="trust-strip" aria-label="MoveIn trust commitments"><span><ShieldCheck size={17} aria-hidden="true" />Official sources</span><span><Check size={17} aria-hidden="true" />No account or email</span><span><Check size={17} aria-hidden="true" />Uncertainty clearly labeled</span><Link href="/data-sources">See our method <ArrowRight size={15} aria-hidden="true" /></Link></aside>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="text-link" href={href}>{children}<ArrowRight size={15} aria-hidden="true" /></Link>;
}
