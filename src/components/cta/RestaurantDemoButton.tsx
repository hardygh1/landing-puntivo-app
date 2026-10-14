"use client";

import { Download } from "lucide-react";
import { site } from "@/config/site";
import { isExternalRestaurantApk } from "@/lib/links";
import { track } from "@/lib/track";

// Solo se renderiza si site.demoApkRestaurante.url tiene valor (features.showRestaurantDemo).
export function RestaurantDemoButton({ location }: { location: string }) {
  const rest = site.demoApkRestaurante;
  if (!site.features.showRestaurantDemo) return null;
  return (
    <a
      href={rest.url}
      {...(isExternalRestaurantApk ? { rel: "noopener" } : { download: rest.fileName })}
      onClick={() => track("download_demo_restaurante", { location })}
      aria-label={`Descargar demo de restaurante de ${site.name} para Android, archivo APK de ${rest.sizeLabel}`}
      className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-6 text-lg font-extrabold text-navy"
    >
      <Download className="size-5" aria-hidden="true" />
      Descargar demo de restaurante
    </a>
  );
}
