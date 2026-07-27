import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const cards: Record<string, { eyebrow: string; title: string }> = {
  timeline: { eyebrow: "MY MOVE TIMELINE", title: "One clear next step at a time." },
  homeowners: { eyebrow: "FOR HOMEOWNERS", title: "Own the home. Learn the home." },
  renters: { eyebrow: "FOR RENTERS", title: "Move in with your records intact." },
  florida: { eyebrow: "WELCOME HOME, FLORIDA", title: "Practical guidance for your Florida move." },
  checklists: { eyebrow: "MOVEIN CHECKLISTS", title: "The moments that matter, organized." },
};

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = cards[slug];
  if (!card) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f8f7f2", color: "#17324a", padding: "74px", position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", width: "540px", height: "540px", borderRadius: "50%", background: "#dcebe4", right: "-110px", top: "-180px" }} />
      <div style={{ position: "absolute", width: "310px", height: "310px", borderRadius: "50%", border: "4px dashed #8bb3a6", right: "105px", bottom: "-90px" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "880px", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", fontSize: "28px", fontWeight: 800 }}><span style={{ width: "46px", height: "46px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px", background: "#df6c55", color: "white" }}>⌂</span>MoveIn</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}><div style={{ color: "#4f8675", fontSize: "22px", fontWeight: 800, letterSpacing: "4px" }}>{card.eyebrow}</div><div style={{ fontSize: "70px", lineHeight: 1.02, fontWeight: 800, letterSpacing: "-4px" }}>{card.title}</div></div>
        <div style={{ color: "#df6c55", fontSize: "25px", fontWeight: 700 }}>Everything after the keys.</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
