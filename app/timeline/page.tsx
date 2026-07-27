import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { TimelineExperience } from "../components/TimelineExperience";
import { timelineStages } from "../data/timeline";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("My Move Timeline", "A practical move-in checklist organized from before move-in through the first year.", "/timeline");

export default function TimelinePage() {
  return <main id="main-content"><PageHero eyebrow="Your plan, at your pace" title="My Move Timeline" description="The answer to “what should I do next?”—organized into eight manageable stages. No account required." /><div className="shell timeline-page"><TimelineExperience stages={timelineStages} /></div></main>;
}
