"use client";

import { Check, ListPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { ADDRESS_CHANGE_TASK_IDS, addTaskToState, getBrowserStorage, readMyMoveState, writeMyMoveState } from "../lib/my-move";

export function AddAddressTasksToMyMoveButton({ sourcePage }: { sourcePage: string }) {
  const [status, setStatus] = useState<"idle" | "saved" | "unavailable">("idle");
  useEffect(() => { queueMicrotask(() => { const storage = getBrowserStorage(); const saved = readMyMoveState(storage).state; if (ADDRESS_CHANGE_TASK_IDS.every((id) => saved.addedTaskIds.includes(id))) setStatus("saved"); }); }, []);
  const addAll = () => {
    const storage = getBrowserStorage();
    if (!storage) { setStatus("unavailable"); return; }
    let state = readMyMoveState(storage).state;
    let added = 0;
    for (const id of ADDRESS_CHANGE_TASK_IDS) { const result = addTaskToState(state, id); state = result.state; if (result.added) added += 1; }
    if (!writeMyMoveState(state, storage)) { setStatus("unavailable"); return; }
    setStatus("saved");
    window.dispatchEvent(new CustomEvent("movein:my-move-updated"));
    if (added) trackEvent("address_tasks_added_to_my_move", { source_page: sourcePage, task_category: "address_admin", task_count: added });
  };
  return <div className="add-to-move-wrap"><button type="button" className="add-to-move" onClick={addAll}>{status === "saved" ? <Check size={16} aria-hidden="true" /> : <ListPlus size={16} aria-hidden="true" />}{status === "saved" ? "Address tasks added to My Move" : "Add all address tasks to My Move"}</button>{status === "unavailable" ? <small className="storage-inline-error">Could not save in this browser.</small> : null}</div>;
}
