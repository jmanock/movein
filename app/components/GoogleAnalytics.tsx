"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { configureAnalyticsDebug, trackPageView } from "../lib/analytics";
import { nextPageView } from "../lib/page-view";

export function GoogleAnalytics({ measurementId, debug = false }: { measurementId?: string; debug?: boolean }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const initialized = useRef(false);
  const privatePause = useRef(false);

  useEffect(() => {
    configureAnalyticsDebug(debug);
    if (!measurementId) return;
    // Pause even a tag already loaded during an earlier public-page visit.
    const analyticsWindow = window as unknown as Record<string, unknown>;
    const disabledKey = `ga-disable-${measurementId}`;
    if (["/receipts", "/my-home", "/sign-in", "/private-access"].includes(pathname)) {
      if (!analyticsWindow[disabledKey]) { analyticsWindow[disabledKey] = true; privatePause.current = true; }
      return;
    }
    if (privatePause.current) { analyticsWindow[disabledKey] = false; privatePause.current = false; }
    if (trackingIsDisabled(measurementId)) return;
    if (!initialized.current) {
      window.dataLayer ??= [];
      window.gtag ??= (...args) => { window.dataLayer?.push(args); };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...(debug ? { debug_mode: true } : {}),
      });
      initialized.current = true;
    }
    const page = nextPageView(lastPage.current, pathname);
    if (!page) return;
    lastPage.current = page;
    trackPageView(page);
  }, [debug, measurementId, pathname]);

  if (!measurementId || ["/receipts", "/my-home", "/sign-in", "/private-access"].includes(pathname) || process.env.NODE_ENV !== "production") return null;
  return <Script id="movein-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`} strategy="afterInteractive" onError={() => undefined} />;
}

function trackingIsDisabled(measurementId: string) {
  if (process.env.NODE_ENV === "test") return true;
  if (process.env.NODE_ENV !== "production") return true;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true) return true;
  return Boolean((window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`]);
}
