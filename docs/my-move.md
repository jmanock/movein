# My Move

Last reviewed: August 10, 2026

My Move is a no-account moving dashboard at `/my-move`. A visitor supplies a move date, five-digit ZIP, and homeowner or renter path. The app builds four sections: before the move, move-in day, first week, and first 30 days.

## Storage model

`movein:my-move:v1` in browser `localStorage` contains only the move date, five-digit ZIP, homeowner or renter selection, completed task IDs, dismissed task IDs, and task IDs added from guides. It does not contain a name, email, phone, exact street address, account credentials, notes, documents, inventory, or checklist text.

The schema is normalized on every read. Invalid, corrupted, or unknown fields fall back safely. When storage is blocked, the current page session remains usable but cannot promise persistence.

## Personalization

Homeowners see shutoff, panel, HOA, HVAC, appliance, maintenance, and official homestead-eligibility review tasks. Renters see condition photography, lease/property routines, insurance proof, and routine/emergency maintenance tasks. Shared tasks cover utilities, internet, address changes, safety, records, trash, and emergency preparation.

The move date is handled as calendar days rather than elapsed hours. Messages include days to go, move-in week, move-in day, days since move-in, and first month. Task completion is never framed as failure.

## Location behavior

For a supported ZIP, the dashboard calls the existing lookup API and shows possible provider names plus links to the full ZIP and county pages. It repeats the exact-address warning. For an unsupported ZIP, the complete general checklist remains available and the visitor can request coverage. My Move never fabricates a local provider.

## Add, reset, and print

Relevant guide, printable, and ZIP-result buttons store one allowlisted task ID. Duplicate clicks do not create duplicate tasks, and a previously dismissed task is restored when explicitly added. Reset uses a native confirmation before clearing the local profile. Printing uses the browser print dialog; no PDF library is loaded.
