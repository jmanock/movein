# Privacy implementation notes

- ZIP searches are read-only database queries and are not stored by the application.
- The lookup asks for no email, account, name, or exact street address.
- The newsletter form and API are removed. The historical SQLite table is retained only to avoid destructive migration; no new writes occur.
- Contact and correction links open the visitor's email application. The site receives nothing unless the visitor sends a message.
- No analytics provider is configured. If aggregate analytics is added later, never include ZIP form values, street addresses, email addresses, full URLs with sensitive parameters, or full IP addresses.
- The API rate limiter hashes the request address to a short in-memory key and expires counts after one minute. It does not persist the raw address or hash.
- Nginx and infrastructure logs are operational data outside the application database and should use documented retention and access controls.
- MoveIn does not sell utility service, ZIP searches, or personal information and is not affiliated with providers or government agencies.
