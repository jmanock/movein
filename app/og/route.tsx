import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawTitle = url.searchParams.get("title")?.trim() || "Find services for your new place";
  const title = rawTitle.slice(0, 92);
  const context = contextLabel(url.searchParams.get("path") ?? "/");
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 78px", color: "#0f3142", background: "linear-gradient(135deg,#fbfaf6 0%,#eef7fb 62%,#e8f2ee 100%)", fontFamily: "Arial, sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ width: 62, height: 62, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#0878b8", color: "white", fontSize: 34 }}>⌂</div><div style={{ display: "flex", fontWeight: 800, fontSize: 42 }}>Move<span style={{ color: "#d95647" }}>In</span></div></div><div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 990 }}><div style={{ display: "flex", color: "#0878b8", fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{context}</div><div style={{ display: "flex", fontSize: title.length > 62 ? 52 : 62, fontWeight: 750, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, color: "#45616d" }}><span>Official sources · Address confirmation</span><span>movein.guide</span></div></div>, { width: 1200, height: 630 });
}

function contextLabel(path: string) { if (path.startsWith("/lookup/")) return "Florida utility lookup"; if (path.startsWith("/homeowners")) return "Homeowner guide"; if (path.startsWith("/renters")) return "Renter guide"; if (path.startsWith("/resources")) return "Moving resource"; if (path === "/faq") return "Questions answered"; return "Everything after the keys"; }
