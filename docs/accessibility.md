# Accessibility review

MoveIn targets WCAG 2.1 AA principles. Automated and source checks support the review, but periodic testing with assistive technology and real users remains valuable.

## Implemented safeguards

- A keyboard-visible skip link leads to the single main landmark.
- Focus indicators use a three-pixel outline with offset.
- Navigation exposes current-page state; the mobile menu reports expanded state, connects to its controlled navigation, closes from its links, and responds to Escape.
- Pathway icons are decorative, mapped to visible card titles, and render with explicit contrasting foreground/background colors.
- CTA arrows and decorative icons are hidden from assistive technology.
- Body, card, navigation, form, timeline, and footer type meets the launch size targets; form controls remain at least 16px on mobile.
- Newsletter errors are visible, announced, connected with `aria-describedby`, and reflected with `aria-invalid`. Entered data is retained after failures and duplicate submissions are blocked while loading.
- Timeline controls use buttons, clear labels, pressed/expanded state, and device-local persistence.
- Links in editorial content and the footer use underlines or another non-color cue.
- Reduced-motion preferences disable transitions and smooth scrolling.
- Layouts are checked at 320, 375, 390, 768, 1024, 1280, and 1440 CSS pixels without horizontal overflow.
- The custom 404 offers clear links to the timeline and major hubs and returns a real 404 response.

## Manual regression checklist

1. Navigate the header, mobile menu, pathway cards, timeline tasks, newsletter, details disclosures, related links, and footer using only Tab, Shift+Tab, Enter, Space, and Escape.
2. Zoom to 200% and confirm headings, cards, forms, and the footer do not overlap or clip.
3. Check light and dark themes for text, borders, focus rings, error messages, and icon contrast.
4. Confirm page titles, H1s, landmarks, breadcrumbs, lists, and form labels are announced meaningfully with VoiceOver, NVDA, or another screen reader.
5. Verify content remains available and understandable when images are blocked.
