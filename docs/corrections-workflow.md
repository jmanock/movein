# Corrections workflow

The public form requires a ZIP, issue type, and description. Category, provider name, official source URL, and reply email are optional. The server validates fields, uses parameterized SQL, applies a short form-timing check, a honeypot, and an in-memory per-address rate limit.

Reports are stored in `correction_submissions`, separate from verified provider data. The review workflow is `new`, `reviewing`, `accepted`, `rejected`, or `resolved`. Existing legacy status remains in place for backward compatibility during the additive migration. Emails are private review data and are never rendered publicly.

Reviewer steps:

1. Move a new report to reviewing.
2. Check the submitted claim against an official provider or government source.
3. Mark unsupported reports rejected with private review notes outside public data.
4. For accepted reports, update the reviewed CSV and source record; run validation and a dry-run import.
5. Import with `--confirm-verified`, then mark the report resolved only after production verification.

Submissions never update provider rows automatically.
