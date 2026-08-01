import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteChrome } from "./components/SiteChrome";
import { DEFAULT_DESCRIPTION, SITE_URL } from "./lib/metadata";
import "./globals.css";
import { AnalyticsBridge } from "./components/AnalyticsBridge";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Find Utilities and Essential Services by ZIP Code | MoveIn", template: "%s | MoveIn" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "MoveIn",
  authors: [{ name: "MoveIn", url: SITE_URL }],
  creator: "MoveIn",
  icons: { icon: "/movein-icon.png", shortcut: "/movein-icon.png", apple: "/movein-icon.png" },
  manifest: "/manifest.webmanifest",
  openGraph: { siteName: "MoveIn", type: "website", images: [{ url: "/images/seo/movein-og-2026-v2.png", width: 1200, height: 630, alt: "MoveIn — Everything after the keys" }] },
  twitter: { card: "summary_large_image", images: ["/images/seo/movein-og-2026-v2.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const validMeasurementId = measurementId && /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : undefined;
  const analyticsEnabled = process.env.NODE_ENV !== "test" && (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_GA_ENABLE_DEV === "true");
  return <html lang="en"><body className={geistSans.variable}><GoogleAnalytics measurementId={analyticsEnabled ? validMeasurementId : undefined} debug={process.env.NEXT_PUBLIC_GA_DEBUG === "true"} /><AnalyticsBridge /><a className="skip-link" href="#main-content">Skip to content</a><SiteChrome>{children}</SiteChrome></body></html>;
}
