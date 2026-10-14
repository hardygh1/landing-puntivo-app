"use client";

import { Download } from "lucide-react";
import { site } from "@/config/site";
import { isExternalApk } from "@/lib/links";
import { track } from "@/lib/track";
import { DOWNLOAD_EVENT } from "@/lib/ui-events";
import { InstallGuideLink } from "./InstallGuideLink";

export type CtaLocation = "hero" | "como-funciona" | "final";

type Props = {
  location: CtaLocation;
  showGuideLink?: boolean;
  /** En escritorio muestra el aviso "Puntivo funciona en Android" (el QR se pasa como hijo). */
  desktopHint?: React.ReactNode;
  dark?: boolean;
  className?: string;
};

export function DownloadDemoButton({ location, showGuideLink = true, desktopHint, dark = true, className = "" }: Props) {
  const { url, fileName, sizeLabel, trialDays } = site.demoApk;

  function onClick() {
    track("download_demo", { location });
    window.setTimeout(() => window.dispatchEvent(new CustomEvent(DOWNLOAD_EVENT)), 1500);
  }

  return (
    <div className={`flex w-full flex-col items-stretch gap-2 sm:w-auto ${className}`}>
      <a
        href={url}
        {...(isExternalApk ? { rel: "noopener" } : { download: fileName })}
        onClick={onClick}
        aria-label={`Descarga la demo gratis de ${site.name} para Android, archivo APK de ${sizeLabel}`}
        className="group inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-full bg-accent px-7 py-2.5 text-navy shadow-accent transition hover:-translate-y-0.5 hover:brightness-105 sm:w-auto"
      >
        <Download className="size-6 shrink-0" strokeWidth={2.6} aria-hidden="true" />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-lg font-extrabold">Descarga la demo gratis</span>
          <span className="text-sm font-semibold">
            Android · {trialDays} días · {sizeLabel}
          </span>
        </span>
      </a>
      {showGuideLink && <InstallGuideLink location={location} dark={dark} />}
      {desktopHint}
    </div>
  );
}
