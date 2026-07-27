import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, PageHero } from "../../components/PageHero";
import { TimelineExperience } from "../../components/TimelineExperience";
import { getStage, timelineStages } from "../../data/timeline";
import { pageMetadata } from "../../lib/metadata";

export function generateStaticParams() { return timelineStages.map((stage) => ({ stage: stage.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }): Promise<Metadata> {
  const { stage: slug } = await params;
  const stage = getStage(slug);
  if (!stage) return {};
  return pageMetadata(`${stage.label} Move-In Checklist`, stage.intro, `/timeline/${stage.slug}`);
}

export default async function TimelineStagePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage: slug } = await params;
  const stage = getStage(slug);
  if (!stage) notFound();
  return <main id="main-content"><div className="shell breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Move Timeline", href: "/timeline" }, { label: stage.label }]} /></div><PageHero eyebrow="My Move Timeline" title={stage.label} description={stage.intro} /><div className="shell timeline-page"><TimelineExperience stages={timelineStages} activeStage={stage.slug} /></div></main>;
}
