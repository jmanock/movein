# Privacy implementation notes

- ZIP searches are read-only database queries and are not stored by the application.
- The lookup asks for no email, account, name, or exact street address.
- The newsletter form and API are removed. The historical SQLite table is retained only to avoid destructive migration; no new writes occur.
- Correction forms store the submitted ZIP, category, provider or record name, issue details, optional official source URL, and optional reply email in the private application database for review. They are not published automatically and must not contain account numbers, passwords, or exact street addresses.
- No analytics provider is configured. If aggregate analytics is added later, never include ZIP form values, street addresses, email addresses, full URLs with sensitive parameters, or full IP addresses.
- API rate limiters hash the request address to a short in-memory key. Lookup counts expire after one minute and correction counts after one hour. They do not persist the raw address or hash.
- Nginx and infrastructure logs are operational data outside the application database and should use documented retention and access controls.
- MoveIn does not sell utility service, ZIP searches, or personal information and is not affiliated with providers or government agencies.
