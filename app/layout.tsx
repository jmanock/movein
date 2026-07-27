import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "welcomehomeflorida.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "Welcome Home Florida | Everything You Need After Getting the Keys",
    description: "Practical checklists, Florida guides, emergency planning, and trusted resources for new Florida homeowners and renters.",
    icons: { icon: "/og.png", shortcut: "/og.png" },
    openGraph: { title: "Welcome Home Florida", description: "Everything you need after getting the keys.", type: "website", url: origin, images: [{ url: `${origin}/og.png`, width: 1734, height: 909, alt: "Welcome Home Florida — Everything you need after getting the keys." }] },
    twitter: { card: "summary_large_image", title: "Welcome Home Florida", description: "Everything you need after getting the keys.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
