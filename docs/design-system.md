# MoveIn design system

MoveIn should feel like a calm, capable technology brand for the first practical questions after receiving the keys. The interface favors editorial rhythm, visible evidence, and direct actions over decorative dashboards.

## Tokens

- Ink `#153047`; soft ink `#4e6474`
- Action blue `#136fb8`; dark blue `#0e568f`; soft blue `#eaf5fb`
- Trust green `#17694e`; aqua `#dff2ef`
- Coral `#d9634c`; warning gold `#f3bd62`
- Cream `#fbfaf6`; white surface; line `#dce4e7`
- Radius: 9px controls, 15px content, 24px major groups
- Section spacing: responsive 64–104px
- Typeface: Geist with system fallbacks

## Components

- `SectionIntro`: eyebrow, outcome-first heading, optional explanation and action.
- `TrustStrip`: source, privacy, and uncertainty commitments beside the lookup.
- `ZipLookupForm`: reusable client form with placement context and controlled states.
- `LookupResults`: evidence hierarchy with coverage labels, address warning, actions, sources, and dates.
- `PrintButton`: dispatches a privacy-safe event and calls `window.print()`.
- Printable data: `app/data/printables.ts`; route: `/resources/printables/[slug]`.

Use cards only for grouped choices or records. Use bordered rows for lists and process lines for sequences. Icons must contain a recognizable Lucide glyph; never ship an empty icon container. The primary action must be stronger than source, phone, and secondary navigation. Reduced motion is honored.

## ZIP states

- Invalid: inline five-digit validation.
- Supported: server-rendered result.
- Mostly verified: visible status and exact-address warning.
- Partial/pending: missing categories stay explicit; no provider is guessed.
- Unsupported valid ZIP: useful self-canonical route with official alternatives and `noindex`.
- System error: retry, home, and resource paths without blame.
