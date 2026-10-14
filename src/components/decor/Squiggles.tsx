// "Rayitas" verdes de impacto, como en las piezas publicitarias.
export function Squiggles({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={`squiggle-beat inline-block ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    >
      <path d="M8 30 L22 18" />
      <path d="M12 41 L32 37" />
      <path d="M6 18 L10 4" />
    </svg>
  );
}
