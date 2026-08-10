# Internet data model

MoveIn keeps Internet providers separate from provider-to-ZIP relationships. The typed source is `app/data/internet.ts`; the normalized public lookup data remains in the providers, service areas, and data sources tables.

## Provider record

Each active provider has an ID, public slug and name, wired or fixed-wireless type, one or more controlled technology values, official site, official address checker, optional transfer and support URLs, market source, source review date, neutral notes, installation note, and active status.

Technology values are `fiber`, `cable`, `dsl`, `fixed-wireless`, `5g-home`, `lte-home`, `internet-air`, `satellite`, and `other`.

The model also reserves optional offer fields: title, description, URL, type, start and end dates, promo code, affiliate flag, affiliate disclosure, and last verification date. They are intentionally empty and have no public UI.

## ZIP relationship

Each relationship stores the ZIP, provider ID, relationship status, evidence URL, evidence review date, and limitation note. Controlled statuses are `possible`, `likely`, `limited`, `address-check-required`, and `research-pending`.

Public relationships use `address-check-required`. MoveIn does not use “verified coverage” because market evidence does not prove service to every address in a ZIP.

## Public lookup mapping

The SQLite lookup exposes provider name, technologies, address checker, transfer URL, official site, evidence review date, and the ZIP relationship limitation. Inactive providers and official lookup tools are excluded from commercial provider counts.

## Validation rules

Active commercial Internet providers require a name, official site, official availability checker, controlled technology label, source, and source date. Validation rejects duplicate provider/ZIP relationships and relationships without typed evidence metadata. It warns on stale evidence or language implying guaranteed ZIP coverage.
