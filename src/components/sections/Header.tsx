"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { site } from "@/config/site";
import { nav } from "@/content/copy";

// Header sticky compacto: azul con logo blanco sobre el hero; blanco con logo a color al bajar.
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-white shadow-[0_6px_20px_-12px_rgb(11_18_32/0.35)]" : "bg-brand-dark"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#descargar" className="relative block h-9 w-[132px] shrink-0 rounded-lg" aria-label={`${site.name}, ir al inicio`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/puntivo-logo-white.svg"
            alt=""
            width={132}
            height={32}
            className={`absolute inset-0 m-auto h-8 w-auto transition-opacity ${scrolled ? "opacity-0" : "opacity-100"}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/puntivo-logo.svg"
            alt=""
            width={132}
            height={32}
            className={`absolute inset-0 m-auto h-8 w-auto transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`}
          />
        </a>

        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`inline-flex min-h-12 items-center rounded-full px-4 text-[15px] font-semibold transition-colors ${
                    scrolled ? "text-navy hover:bg-surface" : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#descargar"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-4 text-[15px] font-extrabold text-navy"
        >
          <Download className="size-4" strokeWidth={2.8} aria-hidden="true" />
          Demo gratis
        </a>
      </div>
    </header>
  );
}
