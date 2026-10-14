import type { ReactNode } from "react";

const colors = {
  accent: "bg-accent text-navy",
  yape: "bg-yape text-white",
  // Texto navy: blanco sobre #00B8E6 no cumple contraste AA
  plin: "bg-plin text-navy",
} as const;

export function Highlight({ children, color = "accent" }: { children: ReactNode; color?: keyof typeof colors }) {
  return <span className={`pill ${colors[color]}`}>{children}</span>;
}
