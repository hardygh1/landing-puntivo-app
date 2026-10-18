import { site } from "@/config/site";

export type WaIntent = keyof typeof site.whatsapp.messages;

export function waLink(intent: WaIntent = "compra") {
  const text = site.whatsapp.messages[intent];
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

const WA_KEY = "puntivo_wa";

/** Número de WhatsApp asignado al azar a este visitante (se recuerda para que siempre le atienda el mismo). Solo cliente. */
export function pickWaNumber() {
  const { numbers } = site.whatsapp;
  try {
    const saved = localStorage.getItem(WA_KEY);
    const found = numbers.find((n) => n.number === saved);
    if (found) return found;
  } catch {}
  const chosen = numbers[Math.floor(Math.random() * numbers.length)];
  try {
    localStorage.setItem(WA_KEY, chosen.number);
  } catch {}
  return chosen;
}

export const isExternalApk = /^https?:\/\//.test(site.demoApk.url);

export const isExternalRestaurantApk = /^https?:\/\//.test(site.demoApkRestaurante.url);

/** URL absoluta (para JSON-LD, OG, sitemap). */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${site.siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export const waAriaLabel = `Escribir a ${site.name} por WhatsApp al ${site.whatsapp.display} (se abre en una nueva pestaña)`;
