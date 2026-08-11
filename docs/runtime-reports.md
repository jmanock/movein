# Runtime reports

Generated validation artifacts now write to the ignored `runtime-reports/` directory. This keeps routine health, SEO, duplication, link, coverage, and provider-link checks from modifying tracked production documentation or data snapshots.

The commands still print pass/fail summaries and return nonzero exit codes for blocking findings. Set `RUNTIME_REPORT_DIR` to place ephemeral output elsewhere. `LINK_STATUS_PATH` and `LINK_REPORT_PATH` remain explicit overrides for provider-link checks.

Tracked files under `docs/` and `data/florida/provider-link-status.csv` are historical reviewed snapshots. Commands read a current runtime provider-link report when one exists and otherwise fall back to the tracked snapshot. Promotion of a runtime artifact into a tracked editorial snapshot must be an intentional review and commit.
