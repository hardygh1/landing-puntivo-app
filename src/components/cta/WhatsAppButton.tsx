"use client";

import { ChevronRight } from "lucide-react";
import { waAriaLabel, waLink, type WaIntent } from "@/lib/links";
import { track } from "@/lib/track";
import { WhatsAppIcon } from "@/components/decor/WhatsAppIcon";

type Props = {
  intent?: WaIntent;
  location: string;
  label?: string;
  /** hero = secundario blanco sobre azul; solid = verde WhatsApp; outline = contorno blanco */
  variant?: "hero" | "solid" | "outline";
  className?: string;
};

const variants = {
  hero: "bg-white text-brand hover:bg-white/90 shadow-soft",
  solid: "bg-whatsapp-dark text-white hover:bg-[#126c34] shadow-wa",
  outline: "border-2 border-white text-white hover:bg-white/10",
} as const;

export function WhatsAppButton({ intent = "compra", location, label = "Comprar por WhatsApp", variant = "solid", className = "" }: Props) {
  return (
    <a
      href={waLink(intent)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${waAriaLabel}`}
      onClick={() => track("whatsapp_click", { location, intent })}
      className={`inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[17px] leading-tight font-extrabold sm:px-6 sm:text-lg transition hover:-translate-y-0.5 sm:w-auto ${variants[variant]} ${className}`}
    >
      <WhatsAppIcon className={`size-6 shrink-0 ${variant === "hero" ? "text-whatsapp-dark" : ""}`} />
      <span>{label}</span>
      <ChevronRight className="size-5 shrink-0" strokeWidth={3} aria-hidden="true" />
    </a>
  );
}
