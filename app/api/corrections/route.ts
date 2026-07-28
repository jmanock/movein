import { getDatabase } from "../../../db/index.ts";
import { validateCorrection } from "../../lib/corrections.ts";
import { checkCorrectionRateLimit } from "../../lib/rate-limit.ts";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = checkCorrectionRateLimit(request);
  if (!limit.allowed) return Response.json({ error: "Too many submissions. Please wait before trying again." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "The submission could not be read. Please check the form and try again." }, { status: 400 }); }
  const validated = validateCorrection(body);
  if (validated.errors) return Response.json({ error: "Please correct the highlighted fields.", fields: validated.errors }, { status: 400 });
  const data = validated.data!;
  if (data.website) return Response.json({ ok: true, message: "Thanks. Your correction was received for review." }, { status: 201 });
  if (!data.startedAt || Date.now() - data.startedAt < 800) return Response.json({ error: "Please take a moment to review the form, then submit it again." }, { status: 429 });
  try {
    getDatabase().prepare(`INSERT INTO correction_submissions
      (zip_code, issue_type, provider_category, provider_name, issue_details, source_url, reply_email, workflow_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`).run(data.zipCode, data.issueType, data.category || "other", data.providerName, data.details, data.sourceUrl || null, data.replyEmail || null);
    return Response.json({ ok: true, message: "Thanks. Your correction was received and will be reviewed before any public record changes." }, { status: 201 });
  } catch (error) {
    console.error("Correction submission failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "We could not save your correction right now. Please try again later." }, { status: 500 });
  }
}
