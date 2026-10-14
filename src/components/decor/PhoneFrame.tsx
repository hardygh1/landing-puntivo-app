import type { ReactNode } from "react";

// Marco de celular Android. La pantalla mantiene la proporción 9 : 19,5 reservada (CLS 0).
// Las capturas ya incluyen la cámara frontal, por eso el marco no la dibuja.
export function PhoneFrame({ children, className = "", video = false }: { children: ReactNode; className?: string; video?: boolean }) {
  return (
    <div className={`relative rounded-[2.4rem] bg-navy p-[9px] shadow-[0_30px_60px_-24px_rgb(11_18_32/0.55)] ring-1 ring-white/10 ${className}`}>
      <div className={`relative overflow-hidden rounded-[1.95rem] ${video ? "aspect-[9/16] bg-navy" : "aspect-[720/1560] bg-white"}`}>{children}</div>
    </div>
  );
}
