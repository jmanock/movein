import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteChrome } from "./components/SiteChrome";
import { DEFAULT_DESCRIPTION, SITE_URL } from "./lib/metadata";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "MoveIn | Find Florida Utilities by ZIP Code", template: "%s | MoveIn" },
  description: DEFAULT_DESCRIPTION,
  applicationName: "MoveIn",
  authors: [{ name: "MoveIn", url: SITE_URL }],
  creator: "MoveIn",
  icons: { icon: "/movein-icon.png", shortcut: "/movein-icon.png", apple: "/movein-icon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geistSans.variable}><a className="skip-link" href="#main-content">Skip to content</a><SiteChrome>{children}</SiteChrome></body></html>;
}
