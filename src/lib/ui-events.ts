import { track } from "@/lib/track";

export const INSTALL_GUIDE_ID = "guia-instalacion";
export const DOWNLOAD_EVENT = "puntivo:download";

/** Abre el acordeón de la guía de instalación y lleva al usuario hasta él. */
export function openInstallGuide(location: string) {
  const el = document.getElementById(INSTALL_GUIDE_ID);
  if (!(el instanceof HTMLDetailsElement)) return;
  if (!el.open) {
    el.open = true;
    track("install_guide_open", { location });
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.querySelector("summary")?.focus({ preventScroll: true });
}
