import { track as vercelTrack } from "@vercel/analytics";
import { site } from "@/config/site";

export type EventName =
  | "download_demo"
  | "download_demo_restaurante"
  | "whatsapp_click"
  | "install_guide_open"
  | "video_play"
  | "video_unmute"
  | "faq_open";

type Gtag = (command: "event", name: string, params?: Record<string, string>) => void;
type Fbq = (command: "track" | "trackCustom", name: string, params?: Record<string, string>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

const UTM_KEY = "puntivo_utm";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/** Guarda los UTM de la URL de llegada en sessionStorage (una vez por sesión). */
export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of UTM_PARAMS) {
      const v = params.get(key);
      if (v) found[key] = v.slice(0, 100);
    }
    if (Object.keys(found).length > 0) sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
  } catch {
    /* sessionStorage no disponible */
  }
}

function readUtm(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

const LEAD_EVENTS: EventName[] = ["download_demo", "whatsapp_click"];

export function track(event: EventName, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...readUtm(), ...params };
  const { gaId, metaPixelId, vercel } = site.analytics;

  if (!gaId && !metaPixelId && !vercel) {
    if (process.env.NODE_ENV !== "production") console.debug("[track]", event, payload);
    return;
  }

  try {
    if (vercel) vercelTrack(event, payload);
    if (gaId && window.gtag) window.gtag("event", event, payload);
    if (metaPixelId && window.fbq) {
      window.fbq("trackCustom", event, payload);
      if (LEAD_EVENTS.includes(event)) window.fbq("track", "Lead", payload);
    }
  } catch {
    /* la analítica nunca debe romper la página */
  }
}
