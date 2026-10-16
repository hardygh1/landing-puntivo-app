import { site } from "@/config/site";
import { heroHeadlines } from "@/content/copy";
import { Highlight } from "@/components/ui/Highlight";
import { SaleSimulation } from "@/components/ui/SaleSimulation";
import { DownloadDemoButton } from "@/components/cta/DownloadDemoButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { DesktopHint } from "@/components/cta/DesktopHint";
import { InstallGuideLink } from "@/components/cta/InstallGuideLink";
import { BrushRibbon } from "@/components/decor/BrushRibbon";
import { Squiggles } from "@/components/decor/Squiggles";

export function Hero() {
  const variants = Object.entries(heroHeadlines) as [keyof typeof heroHeadlines, (typeof heroHeadlines)["a"]][];

  return (
    <section id="descargar" aria-labelledby="hero-titulo" className="relative overflow-hidden bg-hero px-4 pt-6 pb-16 text-white sm:px-6 md:pt-14 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/25">
            App para bodegas y negocios en Perú <span aria-hidden="true">🇵🇪</span>
          </p>

          <h1 id="hero-titulo" className="mt-4 font-display text-[2.5rem] leading-[1.02] font-black tracking-tight text-balance sm:text-5xl lg:text-[4.25rem]">
            {variants.map(([key, h]) => (
              <span key={key} className={`hv hv-${key}`}>
                {h.before}
                <Highlight color={h.color}>{h.highlight}</Highlight>
                {h.after}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/95 md:text-xl">
            La app de ventas e inventario para tu bodega. Escanea, cobra con <strong className="font-bold text-white">Yape o Plin</strong> y controla
            tu stock. <strong className="font-bold text-white">Sin internet.</strong>
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
            <DownloadDemoButton location="hero" showGuideLink={false} />
            <WhatsAppButton intent="compra" location="hero" label="Quiero la app" variant="hero" />
          </div>
          <p className="mt-3 text-[15px] text-white/90">
            Gratis por {site.demoApk.trialDays} días · Sin registro ·{" "}
            <InstallGuideLink location="hero" className="!inline !min-h-0 !px-0" />
          </p>
          <div className="max-w-md">
            <DesktopHint />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[270px] md:max-w-[310px]">
          <Squiggles className="absolute -top-6 -right-8 size-14 text-accent" />
          <SaleSimulation />
          <BrushRibbon className="relative -mt-14 -ml-8 md:-ml-24">Ideal para bodegas y minimarkets</BrushRibbon>
        </div>
      </div>
    </section>
  );
}
