type GtagConfigParameters = {
  send_page_view?: boolean;
  anonymize_ip?: boolean;
  allow_google_signals?: boolean;
  allow_ad_personalization_signals?: boolean;
  debug_mode?: boolean;
};

type GtagEventParameters = Record<string, string | number | boolean | undefined>;

type GtagFunction = {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, parameters?: GtagConfigParameters): void;
  (command: "event", eventName: string, parameters?: GtagEventParameters): void;
};

interface Navigator {
  globalPrivacyControl?: boolean;
}

interface Window {
  dataLayer?: unknown[];
  gtag?: GtagFunction;
}
