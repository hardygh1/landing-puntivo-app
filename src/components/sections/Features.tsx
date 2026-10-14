import { Check, Info } from "lucide-react";
import { tour } from "@/content/copy";
import { Section, SectionTitle } from "@/components/ui/Section";
import { AppScreen } from "@/components/ui/AppScreen";
import { Squiggles } from "@/components/decor/Squiggles";
import { ScreenTour } from "./ScreenTour";

export function Features() {
  const panels = tour.map((item) => (
    <div key={item.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className="relative mx-auto flex w-full max-w-[250px] items-end justify-center md:max-w-[340px]">
        <AppScreen name={item.screen} alt={item.alt} className="w-[78%]" sizes="(min-width: 768px) 270px, 62vw" />
        {item.extra && (
          <AppScreen
            name={item.extra.screen}
            alt={item.extra.alt}
            className="-ml-[30%] mb-[-6%] w-[52%] rotate-3"
            sizes="(min-width: 768px) 180px, 42vw"
          />
        )}
      </div>
      <div>
        <h3 className="font-display text-3xl leading-tight font-black md:text-4xl">{item.title}</h3>
        <p className="mt-3 text-lg text-ink-soft">{item.text}</p>
        <ul className="mt-5 space-y-2.5">
          {item.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 font-semibold">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-navy" aria-hidden="true">
                <Check className="size-4" strokeWidth={3.2} />
              </span>
              {b}
            </li>
          ))}
        </ul>
        {item.note && (
          <p className="mt-5 flex gap-3 rounded-2xl bg-white p-4 text-[15px] leading-relaxed text-ink-soft ring-1 ring-navy/5">
            <Info className="mt-0.5 size-5 shrink-0 text-yape" aria-hidden="true" />
            {item.note}
          </p>
        )}
      </div>
    </div>
  ));

  return (
    <Section id="funciones" className="bg-surface">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle id="funciones-titulo">
          Todo tu negocio en un solo celular
          <Squiggles className="ml-1 size-9 align-top text-brand" />
        </SectionTitle>
        <p className="mt-3 text-lg text-ink-soft">Así se ve Puntivo por dentro.</p>
      </div>
      <div className="mt-8">
        <ScreenTour tabs={tour.map((t) => ({ id: t.id, label: t.tab }))} panels={panels} />
      </div>
    </Section>
  );
}
