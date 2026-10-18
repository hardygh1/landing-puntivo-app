"use client";

import { useEffect } from "react";
import { site } from "@/config/site";
import { pickWaNumber } from "@/lib/links";
import { captureUtm } from "@/lib/track";

// Apunta un enlace wa.me (y su texto/aria-label con el número) al número asignado al visitante.
function retargetWa(a: HTMLAnchorElement, wa: { number: string; display: string }) {
  a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${wa.number}`);
  const label = a.getAttribute("aria-label");
  if (label) a.setAttribute("aria-label", label.replace(site.whatsapp.display, wa.display));
}

// Efectos globales mínimos: guardar UTM, repartir WhatsApp entre números y aparición suave de bloques [data-reveal].
export function ClientEffects() {
  useEffect(() => {
    const wa = pickWaNumber();
    if (wa.number === site.whatsapp.number) return;
    document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach((a) => retargetWa(a, wa));
    document.querySelectorAll<HTMLElement>("[data-wa-display]").forEach((el) => (el.textContent = wa.display));
    // Enlaces que se pintan después (toast, guía…): se corrigen justo al hacer clic
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (a) retargetWa(a, wa);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    captureUtm();

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
