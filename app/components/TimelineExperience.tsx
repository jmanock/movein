"use client";

import Link from "next/link";
import { Check, ChevronDown, Clock3, RotateCcw, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { TimelineStage } from "../data/timeline";
import { trackEvent } from "../lib/analytics";
import { calculateProgress, type CompletionMap } from "../lib/progress";
import { clearCompletion, loadCompletion, saveCompletion } from "../lib/timelineStorage";

export function TimelineExperience({ stages, activeStage }: { stages: TimelineStage[]; activeStage?: string }) {
  const [completion, setCompletion] = useState<CompletionMap>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const visibleStages = activeStage ? stages.filter((stage) => stage.slug === activeStage) : stages;
  const ids = useMemo(() => visibleStages.flatMap((stage) => stage.tasks.map((item) => item.id)), [visibleStages]);
  const progress = calculateProgress(ids, completion);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompletion(loadCompletion(localStorage)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleTask = (id: string) => {
    const next = { ...completion, [id]: !completion[id] };
    setCompletion(next);
    saveCompletion(localStorage, next);
    trackEvent("checklist_interaction", { task_id: id, complete: next[id] });
    if (next[id]) {
      trackEvent("timeline_task_complete", { task_id: id });
      if (calculateProgress(ids, next).percentage === 100) trackEvent("timeline_completion", { scope: activeStage ?? "all" });
    }
  };

  const reset = () => {
    setCompletion({});
    clearCompletion(localStorage);
    trackEvent("timeline_reset", { scope: activeStage ?? "all" });
  };

  return (
    <div className="timeline-experience">
      <div className="timeline-progress" aria-live="polite">
        <div><span>Your progress</span><strong>{progress.percentage}%</strong><p>{progress.completed} of {progress.total} tasks completed</p></div>
        <div className="timeline-progress-track"><i style={{ width: `${progress.percentage}%` }} /></div>
        <button onClick={reset}><RotateCcw size={15} /> Reset progress</button>
      </div>
      {!activeStage && <div className="stage-rail" aria-label="Timeline stages">{stages.map((stage, index) => <Link href={`/timeline/${stage.slug}`} key={stage.slug}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.shortLabel}</b></Link>)}</div>}
      <div className="timeline-groups">
        {visibleStages.map((stage) => (
          <section className="timeline-group" key={stage.slug} id={stage.slug}>
            <div className="timeline-group-heading"><div><span className="kicker">{stage.label}</span><h2>{stage.intro}</h2></div>{!activeStage && <Link href={`/timeline/${stage.slug}`}>Focus on this stage</Link>}</div>
            <div className="task-list">
              {stage.tasks.map((item) => {
                const isComplete = !!completion[item.id];
                const isExpanded = !!expanded[item.id];
                return <article className={isComplete ? "task-card complete" : "task-card"} key={item.id}>
                  <button className="task-check" onClick={() => toggleTask(item.id)} aria-pressed={isComplete} aria-label={`${isComplete ? "Mark incomplete" : "Mark complete"}: ${item.title}`}><Check size={16} /></button>
                  <div className="task-body"><div className="task-meta"><span className={`priority ${item.priority.toLowerCase().replaceAll(" ", "-")}`}>{item.priority}</span><span>{item.category}</span><span><Clock3 size={13} /> {item.estimatedMinutes} min</span></div><h3>{item.title}</h3><p>{item.explanation}</p>{isExpanded && <div className="task-details"><p>{item.details ?? "Save any useful notes, photos, receipts, or confirmation numbers with your home records."}</p>{item.relatedGuide && <Link href={item.relatedGuide.href}>{item.relatedGuide.label}</Link>}{item.affiliateDisclosure && <small>{item.affiliateDisclosure}</small>}</div>}</div>
                  <button className="task-expand" onClick={() => setExpanded({ ...expanded, [item.id]: !isExpanded })} aria-expanded={isExpanded} aria-label={`${isExpanded ? "Hide" : "Show"} details for ${item.title}`}><ChevronDown size={18} /></button>
                </article>;
              })}
            </div>
          </section>
        ))}
      </div>
      <aside className="professional-note"><ShieldAlert size={20} /><p>MoveIn offers general educational guidance. Use qualified professionals for legal, financial, insurance, electrical, structural, construction, safety, or real estate decisions.</p></aside>
    </div>
  );
}
