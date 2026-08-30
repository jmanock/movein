# Analytics privacy audit

Audit date: August 29, 2026

## Result

MoveIn uses one typed event utility. Reviewed calls send public route context, public provider or organization names, coarse coverage information, task categories, move phase, audience type, and aggregate counts. They do not serialize forms, My Move profiles, checklist labels, correction descriptions, calculator values, street addresses, leases, utility accounts, or identity documents.

The shared sanitizer drops these keys if a future JavaScript caller supplies them: email, reply email, routine ZIP fields, move date, notes, checklist or task text, street or exact address, phone number, account number, details, description, SSN, amount, cost, rent, deposit, dollar values, and lease details. TypeScript event definitions provide the first allowlist; the sanitizer is a second defense.

## Reviewed event groups

- ZIP lookup: submit, supported, partial, and unsupported outcomes use source page plus county, state, coverage status, and provider-category count where available. Routine lookup events do not send the entered ZIP.
- Unsupported coverage requests: `zip_coverage_request` intentionally sends one validated five-digit requested ZIP without email or any other identifier so aggregate expansion demand can be measured.
- Internet: hub, search, comparison, saved provider, provider view, availability, transfer, technology filter, and checklist events use public provider/technology/status context.
- Provider links: official-link and phone-click events use the published business name, service category, link type, county, and phone type. They never send the telephone number.
- Address administration: page view, checklist started, task category, print, bulk add, official USPS, government-resource, and return-progress events contain no new address or checklist text.
- My Move: start, resume, completed task, reset, and add events use homeowner/renter, coarse phase, category, and source page. The selected move date and profile are not sent.
- Renter calculator: only start, completion, and aggregate expense-category count are sent. Entered financial values are never sent.
- Corrections: success sends only the public corrections route; submitted email and description are excluded.

## Prohibited data

Do not add street addresses, names, email addresses, visitor-entered phone numbers, utility account numbers, driver-license data, Social Security numbers, correction descriptions, notes, lease contents, move dates, checklist text, or exact calculator values to an analytics event. Do not place those values in URLs or `source_page`.

The debug logger uses only the already-sanitized event object. Analytics and logging failures are non-critical and never surface to visitors.
