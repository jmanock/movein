# Privacy implementation notes

- My Move uses browser `localStorage` for the move date, five-digit ZIP, homeowner/renter choice, completed task IDs, dismissed task IDs, and allowlisted tasks added from content pages. It does not sync this state to the application database. Clearing browser storage or using Reset My Move removes it. If storage is blocked, the current session remains usable without a persistence promise.
- My Move analytics receives coarse task categories, audience, derived move phase, public resource slugs, reminder IDs, and source routes. It does not receive the move date, checklist text, notes, exact street address, account data, or private home records.
- Internet comparison uses `movein:internet-comparison:v1` for up to four public provider records and an optional five-digit ZIP. It stores no street address, email, phone, account number, price, or note, does not sync to the server, and can be cleared from `/internet/compare`.
- My Move may store up to four public Internet provider names. Exact address and installation dates are not stored.

- ZIP searches are read-only database queries and are not stored by the application.
- The lookup asks for no email, account, name, or exact street address.
- The newsletter form and API are removed. The historical SQLite table is retained only to avoid destructive migration; no new writes occur.
- Correction forms store the submitted ZIP, category, provider or record name, issue details, optional official source URL, and optional reply email in the private application database for review. They are not published automatically and must not contain account numbers, passwords, or exact street addresses.
- Google Analytics 4 measures aggregate page visits and privacy-safe interactions. MoveIn does not send entered ZIP values, street addresses, emails, correction descriptions, utility account information, phone numbers entered by visitors, or full IP addresses as analytics event parameters.
- API rate limiters hash the request address to a short in-memory key. Lookup counts expire after one minute and correction counts after one hour. They do not persist the raw address or hash.
- Nginx and infrastructure logs are operational data outside the application database and should use documented retention and access controls.
- MoveIn does not sell utility service, ZIP searches, or personal information and is not affiliated with providers or government agencies.
