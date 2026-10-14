// Subrayado curvo (para palabras en verde sobre fondo azul)
export function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true" className={`absolute -bottom-2 left-0 h-3 w-full ${className}`}>
      <path d="M3 11 C 50 2, 120 2, 197 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function UnderlinedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-accent">
      {children}
      <Underline className="text-accent" />
    </span>
  );
}
