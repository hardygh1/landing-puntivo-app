"use client";

import { ChevronDown } from "lucide-react";
import { track } from "@/lib/track";

// Acordeón nativo <details>: operable con teclado y sin JS (el JS solo registra el evento).
export function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <details
      className="rounded-2xl bg-white shadow-soft ring-1 ring-navy/5"
      onToggle={(e) => {
        if (e.currentTarget.open) track("faq_open", { question: String(index + 1) });
      }}
    >
      <summary className="flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left">
        <span className="text-lg leading-snug font-bold">{q}</span>
        <ChevronDown className="chev size-5 shrink-0 text-brand transition-transform" aria-hidden="true" />
      </summary>
      <p className="px-5 pb-5 text-ink-soft">{a}</p>
    </details>
  );
}
