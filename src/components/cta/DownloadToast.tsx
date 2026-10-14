"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, X } from "lucide-react";
import { waAriaLabel, waLink } from "@/lib/links";
import { track } from "@/lib/track";
import { DOWNLOAD_EVENT, openInstallGuide } from "@/lib/ui-events";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

// Hoja inferior no bloqueante que aparece 1,5 s después de pulsar "Descarga la demo".
export function DownloadToast() {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const show = () => {
      setOpen(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setOpen(false), 15000);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(DOWNLOAD_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(DOWNLOAD_EVENT, show);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md md:bottom-6">
      {open && (
        <div className="rounded-3xl bg-navy p-5 text-white shadow-2xl ring-1 ring-white/10">
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-accent" aria-hidden="true" />
            <p className="flex-1 font-semibold">¡Tu descarga empezó! Cuando termine, ábrela desde Descargas. ¿Te ayudamos?</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-m-2 inline-flex size-12 shrink-0 items-center justify-center rounded-full text-white/80 hover:text-white"
              aria-label="Cerrar aviso"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 grid gap-2 min-[400px]:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openInstallGuide("toast");
              }}
              className="min-h-12 rounded-full bg-white px-3 text-[15px] font-bold text-brand"
            >
              Ver cómo instalar
            </button>
            <a
              href={waLink("demoAyuda")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Escríbenos por WhatsApp: ${waAriaLabel}`}
              onClick={() => track("whatsapp_click", { location: "toast-descarga", intent: "demoAyuda" })}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-whatsapp-dark px-3 text-center text-[15px] leading-tight font-bold text-white"
            >
              <WhatsAppIcon className="size-5 shrink-0" />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
