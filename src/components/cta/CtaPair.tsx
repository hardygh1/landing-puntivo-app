import type { WaIntent } from "@/lib/links";
import { DownloadDemoButton, type CtaLocation } from "./DownloadDemoButton";
import { WhatsAppButton } from "./WhatsAppButton";

// CTA doble: demo (principal) + WhatsApp (venta).
export function CtaPair({
  location,
  dark = false,
  intent = "compra",
  waLabel = "Comprar por WhatsApp",
  className = "",
}: {
  location: CtaLocation;
  dark?: boolean;
  intent?: WaIntent;
  waLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start ${className}`}>
      <DownloadDemoButton location={location} dark={dark} />
      <WhatsAppButton intent={intent} location={location} label={waLabel} variant={dark ? "hero" : "solid"} />
    </div>
  );
}
