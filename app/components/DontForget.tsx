"use client";

import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "../lib/analytics";

const reminders = [
  { id: "meter-readings", text: "Photograph electric and water meter readings on move-in day.", href: "/resources/things-people-forget-when-moving" },
  { id: "water-shutoff", text: "Find your main water shutoff before an emergency happens.", href: "/homeowners/find-water-shutoff" },
  { id: "address-updates", text: "Update banks, insurance, payroll, and shopping addresses after USPS.", href: "/resources/printables/address-update-checklist" },
  { id: "outage-numbers", text: "Save utility outage numbers before you need them.", href: "/resources/printables/outage-emergency-numbers" },
  { id: "alarms", text: "Test smoke and carbon monoxide alarms after moving in.", href: "/homeowners/first-week-home-safety" },
  { id: "hvac-filter", text: "Check your HVAC filter size and replacement guidance.", href: "/homeowners/home-records-and-maintenance" },
  { id: "trash-day", text: "Confirm trash and recycling pickup days for the exact property.", href: "/resources/find-trash-service" },
  { id: "rental-condition", text: "Take photos of rental condition before unpacking.", href: "/renters/document-move-in-condition" },
] as const;

export function DontForget({ sourcePage }: { sourcePage: string }) {
  const pageOffset = [...sourcePage].reduce((total, character) => total + character.charCodeAt(0), 0);
  const index = pageOffset % reminders.length;
  useEffect(() => {
    trackEvent("dont_forget_impression", { reminder_id: reminders[index].id, source_page: sourcePage });
  }, [index, sourcePage]);
  const reminder = reminders[index];
  return <aside className="dont-forget"><span><Lightbulb size={18} aria-hidden="true" /> Don&apos;t forget this</span><p>{reminder.text}</p><Link href={reminder.href} onClick={() => trackEvent("dont_forget_action", { reminder_id: reminder.id, source_page: sourcePage })}>See the helpful resource <ArrowRight size={15} aria-hidden="true" /></Link></aside>;
}
