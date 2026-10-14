"use client";

import { INSTALL_GUIDE_ID, openInstallGuide } from "@/lib/ui-events";

export function InstallGuideLink({ location, dark = true, className = "self-center" }: { location: string; dark?: boolean; className?: string }) {
  return (
    <a
      href={`#${INSTALL_GUIDE_ID}`}
      onClick={(e) => {
        e.preventDefault();
        openInstallGuide(location);
      }}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-3 text-[15px] font-semibold underline decoration-2 underline-offset-4 ${
        dark ? "text-white decoration-accent" : "text-brand decoration-brand/40"
      } ${className}`}
    >
      ¿Cómo instalo el APK?
    </a>
  );
}
