import { site } from "@/config/site";

export type WaIntent = keyof typeof site.whatsapp.messages;

export function waLink(intent: WaIntent = "compra") {
  const text = site.whatsapp.messages[intent];
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const isExternalApk = /^https?:\/\//.test(site.demoApk.url);

export const isExternalRestaurantApk = /^https?:\/\//.test(site.demoApkRestaurante.url);

/** URL absoluta (para JSON-LD, OG, sitemap). */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${site.siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export const waAriaLabel = `Escribir a ${site.name} por WhatsApp al ${site.whatsapp.display} (se abre en una nueva pestaña)`;
