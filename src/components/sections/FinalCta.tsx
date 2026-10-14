import { Highlight } from "@/components/ui/Highlight";
import { AppScreen } from "@/components/ui/AppScreen";
import { CtaPair } from "@/components/cta/CtaPair";
import { Squiggles } from "@/components/decor/Squiggles";

export function FinalCta() {
  return (
    <section id="empieza" aria-labelledby="empieza-titulo" className="relative overflow-hidden bg-night px-4 py-16 text-white sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 id="empieza-titulo" className="font-display text-[2.25rem] leading-[1.05] font-black tracking-tight text-balance md:text-6xl">
            Tu negocio, ordenado desde <Highlight>hoy</Highlight>
            <Squiggles className="ml-2 size-12 align-top text-accent" />
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/90 md:text-xl">Pruébala 3 días gratis. Cuando estés listo, la activas sin perder nada.</p>
          <CtaPair location="final" dark className="mt-8" />
        </div>
        <div className="mx-auto w-full max-w-[240px] md:max-w-[260px]">
          <AppScreen
            name="venta-exitosa"
            alt="Pantalla de ¡Venta exitosa! de Puntivo POS con la nota de venta lista para compartir por WhatsApp o PDF"
            sizes="260px"
          />
        </div>
      </div>
    </section>
  );
}
