import type { LucideIcon } from "lucide-react";

const tones = {
  brand: "bg-brand text-white",
  whatsapp: "bg-whatsapp-dark text-white",
  yape: "bg-yape text-white",
  amber: "bg-amber text-navy",
  accent: "bg-accent text-navy",
  danger: "bg-danger text-white",
  navy: "bg-navy text-accent",
  muted: "bg-slate-200 text-slate-600",
} as const;

export type Tone = keyof typeof tones;

export function IconCircle({ icon: Icon, tone = "brand", size = "md" }: { icon: LucideIcon; tone?: Tone; size?: "sm" | "md" }) {
  const dims = size === "sm" ? "size-12" : "size-16";
  const icon = size === "sm" ? "size-6" : "size-8";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full ${dims} ${tones[tone]}`} aria-hidden="true">
      <Icon className={icon} strokeWidth={2.2} />
    </span>
  );
}
