import type { LucideIcon } from "lucide-react";
import { Bike, BookOpen, Hammer, Pill, Shirt, ShoppingBasket, Store, UtensilsCrossed } from "lucide-react";
import { businesses } from "@/content/copy";
import { waAriaLabel, waLink } from "@/lib/links";
import { RestaurantDemoButton } from "@/components/cta/RestaurantDemoButton";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

const icons: Record<(typeof businesses)[number]["key"], LucideIcon> = {
  bodega: Store,
  minimarket: ShoppingBasket,
  restaurante: UtensilsCrossed,
  libreria: BookOpen,
  ferreteria: Hammer,
  botica: Pill,
  ropa: Shirt,
  delivery: Bike,
};

export function ForWho() {
  return (
    <section id="para-quien" aria-labelledby="para-quien-titulo" className="bg-white px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 id="para-quien-titulo" className="font-display text-[2rem] leading-[1.08] font-black tracking-tight text-balance sm:text-4xl md:text-5xl">
          Hecho para negocios como el tuyo
        </h2>

        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {businesses.map((b) => {
            const Icon = icons[b.key];
            return (
              <li key={b.key} className="inline-flex items-center gap-2 rounded-full bg-surface py-2 pr-4 pl-2 font-semibold">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white" aria-hidden="true">
                  <Icon className="size-4" />
                </span>
                {b.label}
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-ink-soft">
          ¿Tienes un restaurante o cevichería?{" "}
          <a
            href={waLink("restaurante")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escríbenos: ${waAriaLabel}`}
            className="inline-flex items-center gap-1.5 font-bold text-whatsapp-dark underline decoration-2 underline-offset-4"
          >
            <WhatsAppIcon className="size-5" />
            Escríbenos
          </a>
        </p>
        <div className="mt-4 flex justify-center">
          <RestaurantDemoButton location="para-quien" />
        </div>
      </div>
    </section>
  );
}
