import { existsSync } from "node:fs";
import path from "node:path";

type Props = {
  name: string; // base en public/img, p. ej. "yape-plin" → /img/yape-plin-640.webp
  widths: number[];
  width: number; // intrínseco (para reservar proporción)
  height: number;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

// <picture> con AVIF + WebP pre-optimizados (scripts/optimize-images.mjs).
// Si el asset no existe en build, muestra un placeholder con la proporción reservada.
export function Picture({ name, widths, width, height, alt, sizes, priority = false, className = "" }: Props) {
  const largest = widths[widths.length - 1];
  const file = path.join(process.cwd(), "public", "img", `${name}-${largest}.webp`);
  if (!existsSync(file)) {
    console.warn(`TODO: falta public/img/${name}-${largest}.webp — ejecuta "npm run optimize:images"`);
    return <div aria-hidden="true" className={`bg-surface ${className}`} style={{ aspectRatio: `${width} / ${height}` }} />;
  }
  const set = (ext: string) => widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/img/${name}-${widths[0]}.webp`}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
