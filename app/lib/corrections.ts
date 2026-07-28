export const correctionCategories = [
  ["electricity", "Electricity"], ["water", "Water"], ["sewer", "Sewer"],
  ["natural-gas", "Natural gas"], ["internet", "Internet"],
  ["trash-recycling", "Trash & recycling"], ["local-government", "Local government"],
  ["other", "Other"],
] as const;
export const correctionIssueTypes = [
  ["wrong-electric-provider", "Wrong electric provider"], ["wrong-water-provider", "Wrong water provider"],
  ["missing-provider", "Missing provider"], ["incorrect-phone", "Incorrect phone number"],
  ["broken-website", "Broken website"], ["outdated-outage-number", "Outdated outage number"],
  ["incorrect-location", "Incorrect city or county"], ["other", "Other issue"],
] as const;

export type CorrectionInput = {
  zipCode: string; issueType: string; category: string; providerName: string; details: string;
  sourceUrl: string; replyEmail: string; website: string; startedAt: number;
};

export function validateCorrection(value: unknown): { data?: CorrectionInput; errors?: Record<string, string> } {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const data: CorrectionInput = {
    zipCode: text(input.zipCode), issueType: text(input.issueType), category: text(input.category), providerName: text(input.providerName),
    details: text(input.details), sourceUrl: text(input.sourceUrl), replyEmail: text(input.replyEmail),
    website: text(input.website), startedAt: Number(input.startedAt) || 0,
  };
  const errors: Record<string, string> = {};
  if (!/^\d{5}$/.test(data.zipCode)) errors.zipCode = "Enter a valid five-digit ZIP code.";
  if (!correctionIssueTypes.some(([slug]) => slug === data.issueType)) errors.issueType = "Choose the type of issue.";
  if (data.category && !correctionCategories.some(([slug]) => slug === data.category)) errors.category = "Choose a valid service category.";
  if (data.providerName && (data.providerName.length < 2 || data.providerName.length > 120)) errors.providerName = "Enter 2–120 characters or leave this blank.";
  if (data.details.length < 15 || data.details.length > 2000) errors.details = "Describe the correction in 15–2,000 characters.";
  if (data.sourceUrl && (!isHttpUrl(data.sourceUrl) || data.sourceUrl.length > 500)) errors.sourceUrl = "Enter a complete http:// or https:// source URL.";
  if (data.replyEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyEmail) || data.replyEmail.length > 254)) errors.replyEmail = "Enter a valid email address or leave this blank.";
  return Object.keys(errors).length ? { errors } : { data };
}

function text(value: unknown) { return typeof value === "string" ? value.trim() : ""; }
function isHttpUrl(value: string) { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } }
