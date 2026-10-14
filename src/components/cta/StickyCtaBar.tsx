"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { site } from "@/config/site";
import { isExternalApk, waAriaLabel, waLink } from "@/lib/links";
import { track } from "@/lib/track";
import { DOWNLOAD_EVENT } from "@/lib/ui-events";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

// Barra inferior fija (solo móvil) con los dos CTA; aparece al pasar el hero.
// Reemplaza al botón flotante de WhatsApp (se usa una sola de las dos opciones).
export function StickyCtaBar({ heroId = "descargar" }: { heroId?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(11_18_32/0.3)] transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5">
        <a
          href={site.demoApk.url}
          {...(isExternalApk ? { rel: "noopener" } : { download: site.demoApk.fileName })}
          onClick={() => {
            track("download_demo", { location: "sticky" });
            window.setTimeout(() => window.dispatchEvent(new CustomEvent(DOWNLOAD_EVENT)), 1500);
          }}
          aria-label={`Demo gratis: descarga la demo de ${site.name} para Android, APK de ${site.demoApk.sizeLabel}`}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-accent px-3 text-base font-extrabold text-navy"
        >
          <Download className="size-5" strokeWidth={2.6} aria-hidden="true" />
          Demo gratis
        </a>
        <a
          href={waLink("consulta")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp: ${waAriaLabel}`}
          onClick={() => track("whatsapp_click", { location: "flotante", intent: "consulta" })}
          className="pulse-ring inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-whatsapp-dark px-3 text-base font-extrabold text-white"
        >
          <WhatsAppIcon className="size-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
