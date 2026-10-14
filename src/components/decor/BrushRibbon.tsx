import type { ReactNode } from "react";

// Cinta tipo brochazo azul con texto manuscrito y flecha curva.
export function BrushRibbon({ children, className = "", arrow = true }: { children: ReactNode; className?: string; arrow?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {arrow && (
        <svg viewBox="0 0 60 50" className="h-10 w-12 shrink-0 text-white" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 6 C 2 24, 14 40, 46 40" />
          <path d="M38 31 L47 40 L37 47" />
        </svg>
      )}
      <p className="relative isolate -rotate-3 px-5 py-2 font-hand text-2xl leading-tight font-bold text-white">
        <svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full">
          <path
            d="M6 14 C 60 4, 180 8, 296 6 C 290 22, 298 40, 292 62 C 200 66, 90 60, 4 66 C 10 48, 0 30, 6 14 Z"
            fill="#1F2BD6"
          />
          <path d="M14 10 L 120 7" stroke="#4F5BFF" strokeWidth="3" opacity=".6" />
          <path d="M150 63 L 280 60" stroke="#4F5BFF" strokeWidth="3" opacity=".6" />
        </svg>
        {children}
      </p>
    </div>
  );
}
