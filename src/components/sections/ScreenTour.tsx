"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = { id: string; label: string };

// Pestañas accesibles (patrón WAI-ARIA): una pantalla de la app a la vez.
// Los paneles llegan renderizados desde el servidor; aquí solo se elige cuál se ve.
export function ScreenTour({ tabs, panels }: { tabs: Tab[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Enlaces como #yape-plin o #etiquetas abren su pestaña
  useEffect(() => {
    const open = () => {
      const hash = window.location.hash.slice(1);
      const alias: Record<string, string> = { "yape-plin": "cobrar" };
      const i = tabs.findIndex((t) => t.id === (alias[hash] ?? hash));
      if (i >= 0) setActive(i);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [tabs]);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    let next = active;
    if (e.key in keys) next = (active + keys[e.key] + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Funciones de Puntivo POS"
        onKeyDown={onKey}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-12 shrink-0 rounded-full px-5 text-[15px] font-bold transition-colors ${
              i === active ? "bg-brand text-white" : "bg-white text-navy ring-1 ring-navy/10 hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {panels.map((panel, i) => (
        <div
          key={tabs[i].id}
          id={`panel-${tabs[i].id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tabs[i].id}`}
          hidden={i !== active}
          tabIndex={0}
          className="mt-8 rounded-3xl"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
