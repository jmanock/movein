export const correctionCategories = [
  ["electricity", "Electricity"], ["water", "Water"], ["sewer", "Sewer"],
  ["natural-gas", "Natural gas"], ["internet", "Internet"],
  ["trash-recycling", "Trash & recycling"], ["local-government", "Local government"],
  ["other", "Other"],
] as const;

export type CorrectionInput = {
  zipCode: string; category: string; providerName: string; details: string;
  sourceUrl: string; replyEmail: string; website: string; startedAt: number;
};

export function validateCorrection(value: unknown): { data?: CorrectionInput; errors?: Record<string, string> } {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const data: CorrectionInput = {
    zipCode: text(input.zipCode), category: text(input.category), providerName: text(input.providerName),
    details: text(input.details), sourceUrl: text(input.sourceUrl), replyEmail: text(input.replyEmail),
    website: text(input.website), startedAt: Number(input.startedAt) || 0,
  };
  const errors: Record<string, string> = {};
  if (!/^\d{5}$/.test(data.zipCode)) errors.zipCode = "Enter a valid five-digit ZIP code.";
  if (!correctionCategories.some(([slug]) => slug === data.category)) errors.category = "Choose the service category.";
  if (data.providerName.length < 2 || data.providerName.length > 120) errors.providerName = "Enter the provider or record name (2–120 characters).";
  if (data.details.length < 15 || data.details.length > 2000) errors.details = "Describe the correction in 15–2,000 characters.";
  if (data.sourceUrl && (!isHttpUrl(data.sourceUrl) || data.sourceUrl.length > 500)) errors.sourceUrl = "Enter a complete http:// or https:// source URL.";
  if (data.replyEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyEmail) || data.replyEmail.length > 254)) errors.replyEmail = "Enter a valid email address or leave this blank.";
  return Object.keys(errors).length ? { errors } : { data };
}

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function isHttpUrl(value: string) { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } }
