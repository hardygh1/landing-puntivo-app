"use client";

import { ChevronDown, Smartphone } from "lucide-react";
import { site } from "@/config/site";
import { track } from "@/lib/track";
import { INSTALL_GUIDE_ID } from "@/lib/ui-events";
import { WhatsAppButton } from "./WhatsAppButton";

const steps = [
  {
    title: "Descarga la demo",
    text: `con el botón verde. Si tu conexión es lenta, conéctate a wifi: el archivo pesa ${site.demoApk.sizeLabel}.`,
  },
  {
    title: "Abre el archivo",
    text: `desde la notificación de descarga o desde la app Archivos → Descargas (${site.demoApk.fileName}).`,
  },
  {
    title: "Permite la instalación:",
    text: "si aparece “Por tu seguridad, tu teléfono no puede instalar apps desconocidas de esta fuente”, toca Configuración y activa “Permitir de esta fuente” para Chrome (o WhatsApp, si te lo pasamos por ahí). Luego vuelve atrás.",
  },
  {
    title: "Si aparece Google Play Protect",
    text: "con “App no verificada” o “App desconocida”, toca “Más detalles” → “Instalar de todas formas”. Aparece porque la app no se descargó de Play Store, no porque tenga algo malo.",
  },
  {
    title: "Toca Instalar y luego Abrir.",
    text: "El tour guiado te muestra todo en un minuto. Ya puedes vender con los productos de ejemplo.",
  },
];

export function InstallGuide() {
  return (
    <details
      id={INSTALL_GUIDE_ID}
      className="mx-auto mt-12 max-w-3xl rounded-3xl border-2 border-brand/15 bg-white shadow-soft open:border-brand/30"
      onToggle={(e) => {
        if (e.currentTarget.open) track("install_guide_open", { location: "acordeon" });
      }}
    >
      <summary className="flex min-h-16 items-center gap-4 rounded-3xl p-5 sm:p-6">
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white" aria-hidden="true">
          <Smartphone className="size-6" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-xl leading-tight font-black sm:text-2xl">Instalar la demo es fácil (2 minutos)</span>
          <span className="mt-1 block text-[15px] text-ink-soft">Guía paso a paso para instalar el APK en Android</span>
        </span>
        <ChevronDown className="chev size-6 shrink-0 text-brand transition-transform" aria-hidden="true" />
      </summary>
      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <p className="text-ink-soft">
          Como Puntivo todavía no está en Play Store, se instala desde el archivo que descargas. Es normal que Android te haga un par de preguntas:
          solo es su forma de cuidarte.
        </p>
        <ol className="mt-6 space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent font-display font-black text-navy" aria-hidden="true">
                {i + 1}
              </span>
              <p>
                <span className="sr-only">Paso {i + 1}: </span>
                <strong>{s.title}</strong> {s.text}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-2xl bg-surface p-5">
          <p className="font-semibold">¿Te trabaste en algún paso? Escríbenos y te ayudamos por WhatsApp.</p>
          <WhatsAppButton intent="demoAyuda" label="Ayúdame a instalarla" location="guia-instalacion" className="mt-4" />
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Los nombres de los botones pueden variar un poco según la marca de tu celular (Samsung, Xiaomi, Motorola…).
        </p>
      </div>
    </details>
  );
}
