# Deployment and custom-domain operations

## Release checklist

1. Install dependencies with the committed lockfile.
2. Run `npm run lint`, `npm test`, and `npm run build`.
3. If `db/schema.ts` changed, run `npm run db:generate`, inspect the SQL, and commit the migration.
4. Confirm `.openai/hosting.json` contains only the Sites project ID and logical `DB`/R2 bindings.
5. Commit and push the exact validated source revision to the Sites source repository.
6. Package the built `dist` output, hosting metadata, and migrations with the Sites packaging helper.
7. Save one Sites version using the pushed revision and package.
8. Deploy the saved version with the existing access policy and monitor it to a terminal result.
9. Verify the homepage, timeline completion, Florida guide, policy pages, sitemap, robots file, and a newsletter submission.

## Runtime configuration

- Required D1 binding: `DB`
- Required application environment variables: none
- Optional future integrations: email provider and analytics variables are intentionally not defined until a provider is selected

## Connect movein.guide

1. Add `movein.guide` in Sites custom-domain settings.
2. Copy the exact DNS records supplied by Sites into the authoritative DNS provider.
3. Wait for domain validation and TLS issuance; do not repeatedly remove and re-add records.
4. Verify HTTPS, canonical tags, Open Graph image, `/sitemap.xml`, `/robots.txt`, and D1-backed signup on the custom host.
5. Add the new domain to Search Console and submit the sitemap.
6. Apply and test the redirects in `docs/domain-migration.md`.

## Rollback

Redeploy the prior saved Sites version. If the issue is custom-domain-only, keep the production version and temporarily restore the last known-good domain mapping. Preserve newsletter data; a code rollback should not drop or recreate the production database.
