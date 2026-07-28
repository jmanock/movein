import { getLookupResult, isValidZip } from "../../../db/lookup.ts";
import { checkLookupRateLimit } from "../../lib/rate-limit.ts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const limit = checkLookupRateLimit(request);
  if (!limit.allowed) return Response.json({ error: "Too many lookup requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  const zip = new URL(request.url).searchParams.get("zip")?.trim() ?? "";
  if (!isValidZip(zip)) return Response.json({ error: "Enter a valid five-digit ZIP code." }, { status: 400 });
  try {
    const result = getLookupResult(zip);
    if (!result) return Response.json({ error: "We could not find that ZIP code. Check the number and try again." }, { status: 404 });
    const providers = result.providers;
    return Response.json({ zipCode: result.zipCode, city: result.city, county: result.county, state: result.state,
      stateName: result.stateName, status: result.status, lastUpdated: result.lastUpdated, disclaimer: result.disclaimer, providers: {
      electricity: providers.electricity ?? [], water: providers.water ?? [], sewer: providers.sewer ?? [],
      naturalGas: providers["natural-gas"] ?? [], internet: providers.internet ?? [],
      trashRecycling: providers["trash-recycling"] ?? [], localInformation: providers["local-government"] ?? [],
    } }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    console.error("ZIP lookup failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "We could not complete the lookup right now. Please try again." }, { status: 500 });
  }
}
