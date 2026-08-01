# Accessibility

The front end targets WCAG 2.2 AA fundamentals: semantic landmarks, one H1 on representative pages, visible labels, native controls, skip link, visible `:focus-visible`, 44px mobile menu target, text contrast, image alternatives, and reduced-motion support. Phase 3 local resources remain real links with specific labels, utility sections have stable fragment targets, decorative icons are hidden from assistive technology, and emergency actions use native telephone or link semantics.

Automated smoke coverage lives in `npm run frontend:audit` and `npm test`. Browser review covers 320px and 1280px layouts, menu operation, overflow, focus order, form errors, loading labels, supported/unsupported states, and print output.

Manual responsibilities:

- Retest contrast if tokens change.
- Use a screen reader when navigation, disclosures, or result hierarchy changes.
- Do not replace native form, button, link, list, or `details` semantics with clickable `div` elements.
- Keep provider phone and external-action labels specific out of context.
- PDF accessibility is not applicable; resources use maintainable HTML plus print CSS.
