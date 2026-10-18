"use client";

import { waAriaLabel, waLink } from "@/lib/links";
import { track } from "@/lib/track";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

// Botón flotante de WhatsApp en la esquina inferior izquierda.
// En móvil sube un poco para no chocar con la barra fija de CTA (StickyCtaBar).
export function WhatsAppFloat() {
  return (
    <a
      href={waLink("consulta")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp: ${waAriaLabel}`}
      onClick={() => track("whatsapp_click", { location: "flotante-izquierda", intent: "consulta" })}
      className="pulse-ring fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp-dark text-white shadow-wa transition hover:-translate-y-0.5 hover:bg-[#126c34] md:bottom-6 md:left-6 md:size-16"
    >
      <WhatsAppIcon className="size-8 md:size-9" />
    </a>
  );
}
