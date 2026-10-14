import type { ElementType, ReactNode } from "react";

// Marca un bloque para la aparición suave al entrar en pantalla (ver ClientEffects + globals.css).
export function Reveal({ as: Tag = "div", className = "", children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return (
    <Tag data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
