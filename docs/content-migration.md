# Content migration report

The original site had one homepage route with anchored sections. No useful Florida content was deleted; it was rewritten or moved into the MoveIn hierarchy.

| Old route/content | New route | Action | Redirect | Notes |
|---|---|---|---:|---|
| `/` Welcome Home Florida homepage | `/` | Rewrite | 301 from old origin | Reframed as national MoveIn brand |
| `/#journey` 30-Day Home Journey | `/timeline` | Expand | Source-link update | Now eight stages through first year |
| `/#homeowners` homeowner checklist | `/homeowners` and `/timeline/*` | Merge and expand | Source-link update | Existing safety and maintenance tasks preserved |
| `/#renters` renter guidance | `/renters` | Rewrite | Source-link update | Deposit, inspection, insurance, utilities preserved |
| `/#florida` Florida cards | `/florida` and `/florida/[guide]` | Keep and restructure | Source-link update | Now branded Welcome Home Florida under MoveIn |
| `/#emergency` storm preparation | `/florida/hurricane-prep` | Merge | Source-link update | Professional-information disclaimer added |
| `/#resources` resource cards and estimator | `/resources` and `/checklists` | Merge | Source-link update | Resource architecture preserved; estimator can return in a later tool module |
| `/#newsletter` Welcome Note | Homepage newsletter | Rewrite | Not applicable | Database integration preserved and expanded |
| Homepage article previews | `/blog` | Merge | Not applicable | Converted to an editorial hub foundation |
| Footer placeholder policy links | `/privacy`, `/terms`, `/disclosure` | Replace | Not applicable | Real policy content and disclosure added |

## Intentional legacy reference

“Welcome Home Florida” remains only as the name of MoveIn's Florida regional guide. It should not appear as the company name, organization name, main logo, email sender, or canonical site identity.

## Archive recommendation

Retain the prior production version in Sites as the rollback artifact. There are no separate repository pages that require archival.
