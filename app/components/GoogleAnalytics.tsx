"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "../lib/analytics";

export function GoogleAnalytics({ measurementId, debug = false }: { measurementId?: string; debug?: boolean }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!measurementId || trackingIsDisabled(measurementId)) return;
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
    if (!pathname || lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackPageView(pathname);
  }, [debug, measurementId, pathname]);

  if (!measurementId) return null;
  return <Script id="movein-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`} strategy="afterInteractive" onError={() => undefined} />;
}

function trackingIsDisabled(measurementId: string) {
  if (process.env.NODE_ENV === "test") return true;
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true) return true;
  return Boolean((window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`]);
}
