"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { addTaskToState, MY_MOVE_STORAGE_KEY, parseMyMoveState, writeMyMoveState } from "../lib/my-move";

export function AddToMyMoveButton({ taskId, label = "Add to My Move", sourcePage, className = "add-to-move" }: { taskId: string; label?: string; sourcePage: string; className?: string }) {
  const [status, setStatus] = useState<"idle" | "added" | "saved" | "unavailable">("idle");
  useEffect(() => {
    queueMicrotask(() => { try { if (parseMyMoveState(localStorage.getItem(MY_MOVE_STORAGE_KEY)).addedTaskIds.includes(taskId)) setStatus("saved"); } catch { /* The action reports storage availability when used. */ } });
  }, [taskId]);
  const add = () => {
    try {
      const current = parseMyMoveState(localStorage.getItem(MY_MOVE_STORAGE_KEY));
      const result = addTaskToState(current, taskId);
      if (!writeMyMoveState(result.state, localStorage)) throw new Error("storage unavailable");
      setStatus(result.added ? "added" : "saved");
      window.dispatchEvent(new CustomEvent("movein:my-move-updated"));
      if (result.added) {
        trackEvent("add_to_my_move", { task_category: taskId, source_page: sourcePage });
        if (taskId.startsWith("renter-") || taskId === "condition-photos") trackEvent("renter_add_to_my_move", { task_category: taskId, source_page: sourcePage, homeowner_or_renter: "renter" });
        if (["local-utilities", "electricity", "water-sewer", "internet", "utilities-transfer", "trash"].includes(taskId)) trackEvent("utility_added_to_my_move", { task_category: taskId, source_page: sourcePage });
      }
    } catch { setStatus("unavailable"); }
  };
  const done = status === "added" || status === "saved";
  return <div className={`${className}-wrap`}><button type="button" className={className} onClick={add} aria-describedby={`${taskId}-my-move-status`}>{done ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}{done ? "Added to My Move" : label}</button><span className="sr-only" aria-live="polite" id={`${taskId}-my-move-status`}>{status === "added" ? "Task added to My Move." : status === "saved" ? "This task is already in My Move." : status === "unavailable" ? "Browser storage is unavailable, so this task could not be saved." : ""}</span>{status === "unavailable" ? <small className="storage-inline-error">Could not save in this browser.</small> : null}</div>;
}
