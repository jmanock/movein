# Receipts and My Home

## Current access and ownership (Task 6, October 3, 2026)

All saved receipt records have a household owner. Receipt items and inventory inherit ownership through their source receipt; every repository instance requires a valid household ID. Receipt history and My Home totals are scoped to that owner. The central request resolver now verifies Better Auth sessions and stored household memberships. Legacy shared development access additionally requires AUTH_DEV_HOUSEHOLD=true, development/loopback, and absent auth configuration. Unauthenticated APIs return uncached HTTP 401 and private pages redirect to /sign-in with the intended destination. See [authentication setup](authentication.md); no private production rollout has occurred. The private routes are noindex and excluded from the public sitemap.

See [household-ownership.md](household-ownership.md) for schema, legacy-data handling, public/private boundaries, future session/membership and email/deletion design, migration commands, and the Task 7 decision. No extraction prompts/models or raw-image retention behavior changed. Earlier checkpoints below describe historical stages; this section supersedes their access/status statements.

Task 4 adds receipt intelligence v2 and a local evaluation workflow to Task 3’s real Ollama extraction boundary. No hosted API, model download, deployment or new OCR dependency is added. Migration 009 stores the new receipt type and item role. Upload → extraction → review/correction → explicit transactional save → My Home remains the product flow.

## Task 4: evaluation workflow

Create ignored `receipt-lab/` and put **your existing local receipt photos** there. Top-level JPG/JPEG/PNG files are discovered in filename order; subdirectories and image symlinks are skipped. Original files are read only, never copied, deleted or retained by the evaluator. It runs one image at a time through the same configured real extraction pipeline as the API and receipt:test. It never imports or writes the application repository/database, never installs models, and uses only the existing loopback Ollama restriction. NODE_ENV must be development, with RECEIPT_EXTRACTOR=ollama.

Optional sidecars use the same stem: `hardware.jpg` + `hardware.expected.json`. Avoid multiple image files with the same stem unless they deliberately share expectations. The sidecar is a **partial domain receipt**, not a provider payload or a report wrapper. Missing expected fields are unmeasured; explicit null is an expected unknown, not a wildcard. Every expected item requires a nonempty rawDescription for alignment. Money must be integer minor units. Expected quantities reflect the normalized positive quantity (unknown wire quantities become 1 with a warning). Strings/arrays/money/dates/enums are validated before inference; malformed sidecars are per-file errors and do not stop other receipts.

Use [receipt-evaluation.example.json](receipt-evaluation.example.json) as an annotation template. Replace every sample fact using the actual photo. Include the printed text you want to measure in rawDescription, including price/continuation text when your annotation treats it as part of the line; spacing/case are folded for capture scoring, but extra/missing words or prices are reported. Do not generate “expected” truth from the model being evaluated. `acceptableNames` is optional, explicit human-approved alternatives to normalizedName; no automatic product lookup/enrichment occurs.

### Exact commands for five real receipts

```bash
mkdir -p receipt-lab receipt-eval-reports
# Place five existing JPG/JPEG/PNG photos in receipt-lab yourself.
# Optionally annotate each as <image-stem>.expected.json using the template.
export RECEIPT_EXTRACTOR=ollama
export OLLAMA_BASE_URL=http://127.0.0.1:11434
export OLLAMA_RECEIPT_MODEL=qwen2.5vl:7b
export OLLAMA_RECEIPT_TIMEOUT_MS=180000
export RECEIPT_PROMPT_VERSION=movein-receipt-v2
npm run receipt:eval -- ./receipt-lab --report ./receipt-eval-reports/qwen7b-v2-run1.json

# Preserved prompt baseline (same installed model and corpus):
RECEIPT_PROMPT_VERSION=movein-receipt-v1 npm run receipt:eval -- ./receipt-lab --report ./receipt-eval-reports/qwen7b-v1-run1.json

# Another ALREADY installed local vision model; substitute its name:
OLLAMA_RECEIPT_MODEL=another-installed-vision-model npm run receipt:eval -- ./receipt-lab --report ./receipt-eval-reports/other-v2-run1.json
```

No report flag means terminal output only; normalized results are printed even when expectations exist. Reports are opt-in, structured purchase information (private), created mode 0600 with exclusive-write semantics: an existing file is never overwritten. Use a new filename for each run. `receipt-lab/` and `receipt-eval-reports/` are gitignored; arbitrary output paths are your responsibility. Report files include timestamp/provider/model/prompt version, individual normalized receipts/durations/quality/errors/comparisons, and aggregate field metrics. They contain no image bytes or raw model envelopes. The CLI intentionally prints structured purchase data, so keep its terminal/report output private. Optional rawDateText is limited printed date evidence, not complete receipt text.

Exit 0 means no extraction/fixture errors and no measured field mismatches. Exit 1 means configuration/IO/extraction errors or at least one comparison mismatch; partial normalized results/report still remain available. Quality warnings alone do not fail a run. With no expectations this is an extraction/latency smoke test, **not** an accuracy assessment. Failures with valid expectations count as failed measured fields, rather than silently disappearing from aggregate metrics. Invalid sidecars count as errors but are excluded from quality denominators.

### Transparent field metrics

Receipt fields: merchant, date, subtotal, tax, total, optional currency/type. Item fields: count/capture, raw description, normalized name, unit/line price, quantity, category, role, household classification. Each measured field reports passed/failed/total separately. Aggregate includes receipt/extraction/error/expectation/warning counts and total/median extraction duration (IO excluded). There is no overall AI score or leaderboard.

Merchant matching folds Unicode compatibility, case, punctuation and whitespace, then compares exactly. Dates, integers, quantities, categories, roles and booleans compare exactly. Names use case/punctuation-folded normalized Levenshtein similarity ≥0.85, or an explicit acceptableNames alternative. Item alignment uses the same similarity on raw descriptions with only an explicit currency-price suffix and a quantity prefix removed **for alignment**. Greedy one-to-one matching is deterministic; best similarity wins, ties prefer matching line total then original line order. Duplicates consume separate slots. Unmatched reference items fail their specified fields; extra actual items are reported and fail item-count accuracy. Raw-description capture independently compares case/whitespace-folded text exactly, retaining punctuation/price differences. An alignment match does not imply a transcription match. Similarity and indexes are exposed in reports. This heuristic is transparent, not an optimal semantic assignment algorithm.

When comparing v1/v2, common purchase fields are directly comparable. V1 does not request roles/type/uncertainty/date evidence; expected v2-only fields may fail for v1. Compare these metrics separately from common-field accuracy. Model/prompt choice requires genuine representative receipt annotations; synthetic smoke runs do not establish real-world accuracy.

## Task 4: schema and interpretation

Default prompt: **movein-receipt-v2** in `prompt.ts`. The exact v1 prompt/schema are preserved in `prompt-v1.ts`; select either using `RECEIPT_PROMPT_VERSION`. Invalid versions fail configuration. The selected version is recorded in evaluator reports and opt-in development diagnostics. The v2 wire schema adds:

- receiptType: purchase / return / mixed / unknown.
- rawDateText: nullable printed date text (≤100 characters), and dateOrder: mdy / dmy / unknown. Both are transient review evidence.
- itemRole: durable_asset / consumable / maintenance_supply / replacement_part / service / food / apparel / other.
- uncertaintyFlags: bounded allowlist of ambiguousName / inferredCategory / uncertainAssetClassification, transient per item.

Migration **009_receipt_intelligence.sql** persists only receipt_type and item_role. Existing receipts default to unknown and old items to other; no retroactive identity/type guesses are made. New domain fields are optional for legacy/demo compatibility. Missing v2 role falls back from the existing asset recommendation to durable_asset or other; missing type is unknown. No fake percentages. Raw descriptions already existed and now retain original whitespace/line breaks; complete image/OCR/provider payload storage is not introduced.

The v2 prompt emphasizes transcription before interpretation, conservative names, durable household significance, small roles, refunds and uncertainty. Numeric size/model tokens unsupported by raw text are removed from normalized names and flagged. Numeric SKU-only descriptions get unknown names and unselected classification. The application cannot reliably validate inferred brands/variants from abbreviation strings; these remain model suggestions requiring review and corpus evaluation. No product web searches occur.

Roles distinguish standalone durable equipment from supplies/components/services/food/apparel. Non-durable/unknown roles, explicit classification uncertainty, negative lines and clear coupon/discount/deposit/fee text suppress model recommendations. A grocery-category consumable role is reconciled to food with a review warning. This is a small consistency rule, not a price threshold or an enormous product taxonomy. Human review can correct role/type and explicitly override recommendations.

### Returns, duplicates, multiline purchases and money

Negative product lines imply return or mixed type depending on whether positive product lines also exist. Coupon/discount/deposit/fee lines are excluded from this type inference; a coupon alone does not turn a purchase into a return. Explicit return receipts start with every line unselected, even if a price is missing. Refund records never automatically remove earlier inventory, and no return-window feature exists. If the human deliberately selects a line after review, the final selection remains authoritative.

Repeated printed items are kept separately, flagged for review and independently evaluated. A strictly price-only/quantity-times-price continuation can be joined to its immediately preceding missing-price item; raw descriptions are concatenated with a newline, existing known unit/line values are preserved, and explicit continuation quantity is read without silently inventing a missing amount. A joined negative line is still excluded from recommendations in mixed receipts. Obvious total/tax/payment rows are excluded using narrowly anchored labels; product names such as Tax Software remain items. The model is also instructed to combine related lines and retain separate coupons, fees and return lines. Arbitrary duplicate merging, coupon allocation, net-price guessing and perfect retailer accounting are out of scope.

All money remains integer cents, including negative and zero amounts. Missing amounts are never zero-filled or calculated into new facts. Quantity-price checks use BigInt rational arithmetic and only compare products that are exact cents; fractional-cent results remain unchecked, not rounded. Return sign conventions accept positive or negative unit amounts against a negative refund line. Differences produce warnings without rejecting the review. Existing subtotal/tax/item-total checks remain nonblocking.

### Date and review behavior

ISO dates and ISO timestamps, English month names and clear numeric orders normalize to real YYYY-MM-DD calendar dates. Numeric dates such as 10/01/2026 without sufficient mdy/dmy evidence become unknown even if the model proposed an ISO value. A dollar symbol/USD alone does not establish order. A component >12 can disambiguate order. Two-digit years use a documented 2000–2099 interpretation with an explicit year-review warning; the user can correct historical years. Invalid dates become unknown with a warning in v2; v1 retains its original strict ISO validation. Printed date evidence wins over a conflicting model-normalized guess.

Review keeps the existing layout and adds editable document type/item role, concise recommendation reasons, printed text for uncertain names, printed date evidence, and highlighted date/line controls. Missing price/date/name, ambiguous date/name, inferred category, uncertain asset, role reconciliation, duplicate/continuation and arithmetic warnings are bounded canned messages. Hints are deduplicated by code and line, without confidence percentages. All warnings describe initial extraction; editing does not recompute or silently rewrite purchase facts. No extraction/evaluation action persists app records; only explicit reviewed save does.

## Local setup and first receipt

Install/start Ollama yourself if needed. MoveIn never installs, pulls, or deploys models. Choose a **locally installed vision-capable model**; a text-only model is insufficient. Inspect available models:

```bash
ollama serve                       # only if Ollama is not already running
ollama list
ollama show qwen2.5vl:7b            # example model; choose an installed vision model
```

If you choose to install a model, manually run `ollama pull <vision-model>` after checking its hardware requirements. This is optional operator setup, never an application action. The implementation uses Ollama’s [structured outputs](https://docs.ollama.com/capabilities/structured-outputs) and [chat API](https://docs.ollama.com/api/chat).

In the terminal where you run MoveIn:

```bash
export RECEIPT_EXTRACTOR=ollama
export OLLAMA_BASE_URL=http://127.0.0.1:11434
export OLLAMA_RECEIPT_MODEL=qwen2.5vl:7b   # example; this model was already installed locally
export OLLAMA_RECEIPT_TIMEOUT_MS=180000
npm run db:migrate
npm run receipt:test -- /absolute/path/to/receipt.jpg
npm run dev -- --hostname 127.0.0.1
```

Alternatively copy the settings from `.env.example` to `.env.local`. Visit `http://127.0.0.1:3000/receipts`, upload a real JPG/PNG, check merchant/date/totals and every line, correct model mistakes, choose inventory items, and Save receipt → View My Home. No processing action writes SQLite. Only the explicit reviewed save persists purchase records.

The CLI uses the **same configuration, provider, prompt, normalization and quality checks** as the API. It prints normalized purchase details, warnings and duration to your terminal; it never imports the repository or writes SQLite. Treat this terminal output as private purchase information. It requires the real Ollama provider, even if your UI is configured for demo. Switch models with `OLLAMA_RECEIPT_MODEL=another-installed-vision-model npm run receipt:test -- /path/receipt.png`. Restart the dev server after changing its environment.

## Environment

| Variable | Behavior |
| --- | --- |
| `RECEIPT_EXTRACTOR` | Required: `ollama` for real extraction; `demo` only in development. Missing/invalid configuration fails clearly. No fallback. |
| `OLLAMA_BASE_URL` | Defaults to `http://127.0.0.1:11434`. HTTP literal loopback `127.0.0.1` or `[::1]` only; no credentials, path, query, fragment or redirects. Use the IP rather than `localhost` to avoid DNS ambiguity. |
| `OLLAMA_RECEIPT_MODEL` | Required in Ollama mode. No model hardcoded in application logic. Cloud names and remote-backed models are refused. |
| `OLLAMA_RECEIPT_TIMEOUT_MS` | Default 180000; integer range 1000–600000. One deadline covers model inspection, inference and response reading. Browser deadline adds 15 seconds for upload/transport. |
| `RECEIPT_PROMPT_VERSION` | Defaults to movein-receipt-v2; movein-receipt-v1 is the preserved baseline. |
| `RECEIPT_EXTRACTION_DEBUG` | Default off; only literal `true` with NODE_ENV=development enables a review-screen developer details panel and API/CLI metadata. |

Debug metadata contains provider/model, duration, prompt version, warning codes and whether one complete JSON fence was stripped. No images or raw provider payloads are logged or retained. No raw-output logging option is implemented. Debug details are absent from normal consumer UI and production responses. Model-generated confidence percentages are ignored; extractionConfidence remains null.

For the deterministic fixture, explicitly set `RECEIPT_EXTRACTOR=demo` in development. The UI explains that the document is validated but not read. Saved demo receipts use source_type `test`; real reviewed receipts use `upload`. No silent switch occurs when Ollama fails. Existing demo rows are retained, so use a separate test DATABASE_PATH if you need an uncontaminated evaluation inventory.

## Provider and prompt

Acquisition supplies transport-neutral `ReceiptInput` bytes to `ReceiptExtractor`. `extraction.ts` selects the configured provider, calls the existing `processReceipt`/normalization boundary, and derives review quality. `ollama.ts` first POSTs `/api/show` to verify an already installed local model with vision capability, then POSTs `/api/chat` with stream=false, temperature=0, the JSON output schema, and a base64 image. No `/api/pull` calls occur. HTTP response bodies are bounded to 256 KiB and redirects are rejected.

The dedicated prompt and output schema live in `app/lib/receipts/prompt.ts`; default version **movein-receipt-v2**, with v1 preserved separately. Update this version when experimenting with interpretation changes. The prompt requests faithful transcription, cautious normalized names, semantic durable-versus-consumable classification, unknown fields as null, integer cents, JSON only, and refusal to treat instructions printed on a receipt as commands. The prompt is a model instruction, not a guarantee of accuracy.

## Exact structured output

The wire schema follows the existing camelCase domain, with Task 4’s role/type/evidence fields above. All keys are requested; the parser tolerates omitted optional fields and normalizes them to null. Required usable items and household boolean/category values are validated independently of the model’s constrained output.

```json
{
  "merchant": "Example Hardware",
  "purchaseDate": "2026-10-02",
  "subtotalMinor": 10299,
  "taxMinor": 721,
  "totalMinor": 11020,
  "currency": "USD",
  "items": [
    {
      "rawDescription": "RYOBI 18V DRL KT",
      "normalizedName": "Ryobi 18V Drill Kit",
      "quantity": 1,
      "unitPriceMinor": 9900,
      "totalPriceMinor": 9900,
      "category": "tool",
      "isHouseholdAsset": true,
      "assetReason": "Durable household tool"
    }
  ]
}
```

merchant/date/money/name/reason may be null. Quantity may be null in the wire schema; the existing database/domain requires a positive quantity, so an unreadable quantity becomes **1 with an explicit quantity_assumed review warning**, never silently treated as observed. The warning is ephemeral, not stored as a purchase fact. USD is the only supported receipt currency in this task.

Categories: appliance, electronics, furniture, tool, outdoor, home_equipment, home_improvement, consumable, grocery, clothing, service, other. Classification is semantic: a drill may belong in My Home while a more expensive grocery purchase does not. The model preserves raw descriptions separately from normalized names, and should not invent unsupported brand/model/size/variant details. The user can override names, categories and every recommendation.

## Validation and review

The server strips unrelated provider fields and validates:

- JSON object and item array of 1–100 usable lines; prose and malformed JSON fail. Conservative repair only strips one complete JSON code fence; no guessing/reconstructing data.
- Text strings trimmed and bounded to 500 characters; usable raw descriptions required. Exact optional-text placeholders null/unknown/n/a become unknown (null).
- Real ISO YYYY-MM-DD calendar dates when present.
- Money as safe integer minor units, absolute value ≤1,000,000,000; no dollar floats or decimal strings accepted. Negative amounts can represent discounts/returns. Review uses the existing exact decimal-string-to-cents parser.
- Positive finite quantity ≤100000; finite fractional quantities allowed.
- Actual boolean asset flags and the small category enum.

Missing optional dates/totals remain usable. No lines returns a useful extraction failure. Review quality uses `needs_review` or `missing_information`, without fake percentages. Missing fields/item prices/names/quantities and arithmetic mismatches generate safe warnings and highlighted review controls. Even a clean extraction still needs review.

Subtotal + tax versus total allows a two-cent tolerance. The complete item sum is compared to subtotal, or total minus known tax, with max(two cents, 1%) tolerance. Partial item prices generate missing-price warnings instead of misleading sum comparisons. Mismatches never reject a receipt: fees, tips, coupons, deposits and returns need human judgment. Editing review does not automatically recompute purchase totals.

## Image/PDF and failure behavior

Real extraction supports JPG/JPEG/PNG up to 8 MiB. Metadata and magic-byte signatures are checked before model use. This is not full decoding, malware detection or a pixel-count guarantee. Very large-dimension images may exceed model/hardware capacity. Real PDF extraction returns an honest “not enabled yet; upload JPG or PNG” error. No rendering/OCR dependency stack was added. Email/text is also not enabled, but the same input boundary can support future adapters.

Common failures become canned useful messages without stack traces/raw provider output:

| Failure | Action |
| --- | --- |
| Cannot reach Ollama | Start Ollama; check literal loopback URL and port. |
| Model missing | Run `ollama list`; select an installed vision model. Install only manually if desired. |
| Text-only or remote/cloud model | Choose an installed local vision model. `/api/show` capability checks occur before image submission. |
| Timeout | Try a smaller/sharper image, another local model, or increase timeout up to 600000. |
| Invalid JSON/schema/incomplete response | Try a clearer image or another vision model; inspect opt-in debug warning metadata. |
| PDF | Export/photograph the receipt as JPG/PNG. |
| Currency not confirmed as USD | Use a USD receipt for this task; multi-currency review is deferred. |
| Save failure | Review remains in memory. Retry uses the same request UUID and avoids duplicate saves. |

The busy state remains visible through local inference. Processing errors release the selected file and prompt reselection. Aborted requests do not persist anything. Ollama can keep its model loaded in memory and may continue internal computation briefly after HTTP cancellation; MoveIn keeps no background receipt job.

## Privacy and production

Receipt process/save/list endpoints remain **local-development-only**, restricted to loopback hostnames and same-origin requests. Local extraction sends bytes only to the same machine’s configured loopback Ollama service, never external APIs. Redirects and remote/cloud model metadata are refused. The original file is never saved in SQLite, public/, localStorage, logs, previews or an image library. Application byte references are cleared in finally; request/multipart/base64 buffers leave scope for garbage collection. This is not a secure-erasure guarantee and cannot control independently configured Ollama/system logging.

Only confirmed structured purchase information persists, with all lines and selected inventory items. Local records are shared by browsers using this app/database; they are not private per-browser households. My Move remains independent browser-only checklist storage. Local analytics is disabled. The CLI prints structured results intentionally, so do not redirect private receipts into shared logs.

`next build`/`next start` render unavailable/preparation UI; all three endpoints return 503 before reading bodies or accessing SQLite in production. This preserves the Task 2 ownership boundary even when Ollama is configured. The adapter itself is configuration-driven and has no production demo fallback. Enabling public receipt endpoints requires a separate private-access/household decision. No production Ollama installation, model download, database write or deployment occurred.

Local-only privacy statements describe this implementation; any future cloud adapter needs new disclosure and retention decisions.

## Persistence and database

Migrations 007/008 remain unchanged; Task 4 adds 009 for receipt type/item role. Explicit `npm run db:migrate` is required; startup never runs migrations. SQLite WAL, foreign keys and existing provider data are preserved. Confirmed save validates the structured review and selected indexes, then atomically saves the receipt, all lines and selected inventory. source_type is chosen by the configured server provider, not supplied by the client. Final line asset flags record the user’s selections. Inventory preserves receipt/line IDs, raw versus normalized purchase descriptions, integer prices, merchant and date.

A save UUID and normalized-payload fingerprint make identical retries safe; changed content under a committed UUID returns 409. Failure rolls back the entire save. Zero selections saves receipt details only. One inventory record represents the whole purchase line (including multi-quantity lines); splitting physical units is deferred. The default local DB remains separate from acceptance-test DBs. Future record deletion/export/ownership policies are undecided.

## Checks and future decisions

`npm test` uses mocked HTTP; no Ollama service or models are required. Coverage includes configuration, structured response, JSON/schema errors, optional fields, integer money, raw/normalized names, semantic classification persistence, unavailable/missing/non-vision/remote models, timeouts/cancellation, bounded responses, PDF rejection and no production demo fallback. Existing flow tests cover upload limits, origin/production guards, explicit save, overrides, rollback, provenance and retries. Run `npm run lint`, `npm run build`, `check:links`, `seo:audit` and `frontend:audit` against a local server.

Before Task 5 decide: representative real-photo evaluation and model choice (accuracy/latency/hardware); private household access before production; supported currencies/languages; retention/export/deletion of structured records and demo-data separation; PDF/email ingestion scope; missing quantities and multi-unit inventory semantics. No warranties, returns, rewards, payments, subscriptions or authentication are added.

## Task 3 checkpoint (October 2, 2026)

A. Files: added `app/lib/receipts/{config,errors,extraction,ollama,prompt,quality}.ts`, `scripts/receipt-test.mjs`, `tests/ollama-receipts.test.mjs`; updated receipt `types.ts`, `processing.ts`, `persistence.ts`, `http.ts`, process/save routes, `ReceiptWorkspace.tsx`, `HomeInventory.tsx`, `ReceiptIntro.tsx`, receipt/My Home pages, `app/data/pages.ts`, `app/globals.css`, privacy page, `.env.example`, `package.json`, `README.md`, this document, product concept document, and `tests/receipt-flow.test.mjs`. Task 1/2 changes remain in the same uncommitted workspace. No new migration/dependency.

B. Architecture: existing input/interface → configured provider → local model capability preflight → schema-constrained chat → server validation/quality → human review → transactional save. No fallback or model pulls.

C. Variables: provider/base URL/model, optional 180-second deadline and development-only debug, as documented above.

D. Exact schema: exported `RECEIPT_OUTPUT_SCHEMA` in `prompt.ts`; camelCase purchase fields and item fields illustrated above, enum categories, nullable unknowns and integer minor units. Domain quantity null is handled with a review hint.

E. Prompt: `app/lib/receipts/prompt.ts`, movein-receipt-v1. Date regex uses explicit digit classes compatible with Ollama grammar generation; server checks real calendar dates. A live test caught and fixed unsupported regex shorthand before delivery. Abbreviation examples improve cautious normalization and consumable classification.

F. Validation: ranges/types/date/JSON checks plus nonblocking missing-information and arithmetic warnings. Null-like optional text becomes unknown; no fake confidence. Final user selection controls inventory.

G. JPG/JPEG/PNG are real; PDF/text/email return honest unsupported messages. Original bytes are discarded, including after failure.

H. Manual command: `npm run receipt:test -- /absolute/path/to/receipt.jpg` (real provider required, never persists).

I. Results: 92 automated tests passed, lint passed, production build passed. Runtime links: 112 canonical routes / 138 internal targets, no broken targets/redirects/orphans. SEO: zero errors/warnings. Frontend: no serious failures, existing 26-client-component warning. Production process/save/list endpoints return 503; configured production remains blocked. No external services or production deployment changed.

Live local qwen2.5vl:7b read a **synthetic PNG acceptance receipt**, extracting Example Hardware, 2026-10-02, subtotal 10299, tax 721, total 11020. It recommended the $99 drill and excluded paper towels. HTTP processing took approximately 8.4 seconds warm; standalone prompt evaluation approximately 16 seconds. No receipt persisted before explicit reviewed save. Saving selected index 0 produced one inventory item with source_type upload; a repeated UUID returned the same receipt and no duplicate. Foreign-key check was clean. Browser My Home displayed the saved item on mobile. The browser automation file chooser could not be completed, so live acquisition/save verification used HTTP; Task 2’s graphical review/save checks and current mocked API/review tests remain the evidence for those interactions.

Acceptance data is isolated in ignored `outputs/ollama-flow-qa.sqlite`, structured results `outputs/ollama-http-qa.json`, and screenshot `outputs/ollama-inventory-qa.jpg`. The temporary synthetic receipt image was removed. Default local receipt/inventory counts remain zero. Synthetic testing verifies integration, not accuracy on genuine receipt photos; those still require evaluation.

J. First real receipt: run the exports and CLI command in Local setup above, then upload it in the locally configured app, correct/review, choose household items, save and open My Home. The development server is left at http://127.0.0.1:3017 with qwen2.5vl:7b and the default local database; debug is off. CLI model selection remains an explicit environment choice.

K. Before Task 4: evaluate representative real photos and select a model; decide private household access before enabling production, structured-data retention/deletion/export, demo-data separation, currencies/languages, PDF/email scope and quantity/multi-unit inventory semantics. Task 4 has not started.


## Task 4 checkpoint (October 2, 2026)

A. Files: new `app/lib/receipts/{prompt-v1,intelligence,intelligence-types}.ts`, `scripts/receipt-eval.mjs`, `scripts/lib/receipt-evaluation.mjs`, `tests/receipt-intelligence.test.mjs`, `db/migrations/009_receipt_intelligence.sql`, `docs/receipt-evaluation.example.json`. Updated `app/lib/receipts/{types,processing,config,extraction,ollama,prompt,quality,review,persistence}.ts`, `app/components/ReceiptWorkspace.tsx`, `app/globals.css`, `.env.example`, `.gitignore`, `package.json`, `README.md`, `docs/database.md`, this document, and existing receipt/config/flow tests. Earlier sprint changes remain uncommitted and preserved.

B. Command: `npm run receipt:eval -- ./receipt-lab --report ./receipt-eval-reports/run1.json`. Report optional; no application database access.

C. Fixture: top-level JPG/JPEG/PNG, optional same-stem `.expected.json` partial domain annotation, as in the linked example above. Missing fields are unmeasured; explicit null is measured unknown. Raw description anchors each expected item; acceptableNames supplies manually approved aliases.

D. Schema: receiptType and itemRole persist through migration 009. rawDateText/dateOrder and item uncertaintyFlags are transient evidence. rawDescription preserves whitespace/line breaks. Legacy defaults remain compatible. Local migration 009 was applied after an SQLite online backup at ignored `outputs/movein-before-intelligence.sqlite`; default database has zero receipts and inventory items and a clean foreign-key check.

E. Prompt: meaningful v2 interpretation/schema changes are the default. Exact v1 prompt/schema remain selectable through RECEIPT_PROMPT_VERSION; reports record the selected version. No models were downloaded.

F. Rules: cautious names and unsupported numeric-token removal, SKU uncertainty, narrowly anchored summary-row removal, separate repeated purchases/adjustments, immediate price-continuation joins, conservative dates and exact integer/rational money validation. Unknowns stay unknown; contradictions produce review warnings rather than fabricated accounting.

G. Roles: durable_asset, consumable, maintenance_supply, replacement_part, service, food, apparel, other. Role remains separate from retail category and editable during review. No price-only asset threshold.

H. Returns: purchase/return/mixed/unknown; negative product lines inform type, while coupons/fees are adjustments. Return receipts and negative/uncertain/non-durable lines start unselected. Existing inventory is never automatically removed. Final explicit user selections control save.

I. Uncertainty: semantic flags and bounded canned hints, highlighted date/lines, printed evidence and concise recommendation reasons. No confidence percentages. Original extraction hints remain visible during correction.

J. Checks: 106 tests pass without Ollama, lint passes, production build passes. Runtime links: 112 canonical routes/138 internal targets, no broken links, redirects or orphans. SEO: zero errors/warnings. Frontend: 123 files, 20 representative routes, 143 internal targets, no serious failures; existing 26-client-component warning remains. Production receipt endpoints remain disabled.

Live qwen2.5vl:7b evaluation used five **synthetic** receipt PNGs, not user receipt photos: hardware, grocery, refund, mixed and quantity cases. Both prompts extracted 5/5 with zero provider errors. V2 matched merchant/date/subtotal/tax/total/type/count 5/5, item alignment/line price/household classification 8/8; category and role 6/8. V1 household classification matched 3/8. Raw transcription differed from annotations because the model retained printed price suffixes: v2 0/8, v1 1/8 strict captures. This remains a visible metric, never hidden by item alignment. V2 total/median extraction time was 42622/9067 ms; v1 61029/12690 ms. These small synthetic runs establish integration, not real-world accuracy or a model leaderboard. CLI exit 1 correctly indicated measured mismatches. Private structured reports are ignored under `receipt-eval-reports/synthetic-v2-final-20261002.json` and `synthetic-v1-20261002.json`; temporary generated images were removed.

Browser QA completed upload → review → explicit save with a local mocked provider and isolated SQLite. Document type, role, name, selection and native calendar correction persisted; a second QA record confirms purchase_date 2026-10-01. Automated DOM fill did not update React's native date state, so calendar keyboard selection verified the actual date change. Desktop/mobile had no horizontal overflow. Ignored screenshots: `outputs/receipt-v2-review-desktop.jpg`, `outputs/receipt-v2-saved-mobile.jpg`, `outputs/receipt-v2-date-save-qa.jpg`; isolated database: `outputs/receipt-v2-review-qa.sqlite`. No QA records entered the default database. The real local development server is restored at http://127.0.0.1:3017 with qwen2.5vl:7b, v2, default DB and debug off.

K. Five real receipts: follow the exact exports and receipt-lab/report commands near the top of this document. Supply five existing local photos and manually grounded expected sidecars. Use new report filenames for repeat/model/prompt comparisons. No real user photos were supplied during Task 4.

L. Recommended Task 5 at this historical checkpoint: establish a representative, manually annotated real-photo corpus and compare installed models/prompts using these field metrics. Resolve category/role and raw-text annotation weaknesses before deciding production household ownership/access and structured-record lifecycle.

## Current production hardening (Task 8)

Tasks 5–7 subsequently added the homepage refresh, private ownership and real authentication. The current release verdict and operator instructions are in [task-8-production-readiness.md](task-8-production-readiness.md) and [production-launch-checklist.md](production-launch-checklist.md); the earlier runtime addresses and test counts above are historical.

Set `RECEIPT_EXTRACTOR=disabled` explicitly when extraction is not provisioned. The private receipt page probes real local model metadata with a three-second bound; unavailable/disabled/non-vision models hide the upload form while saved history and My Home remain usable. Production never uses demo extraction or downloads a model. Real uploads require JPG/PNG MIME, extension and signature checks, an 8 MB file limit, and complete image decoding below 20 megapixels. No app temporary/public file is created. Production processing permits one active job, five attempts per household and ten per hashed IP per ten minutes; restart resets these small-process limits. Proxy streaming and request limits are required as documented in the launch checklist.
