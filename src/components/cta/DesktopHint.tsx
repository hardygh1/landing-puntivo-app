import QRCode from "qrcode";
import { Smartphone } from "lucide-react";
import { site } from "@/config/site";

// Aviso para visitantes que no están en Android (decidido por CSS antes de pintar: html.not-android).
// El QR se genera en build como SVG estático y apunta a la sección de descarga.
export async function DesktopHint({ dark = true, withQr = true }: { dark?: boolean; withQr?: boolean }) {
  const target = `${site.siteUrl}/#descargar`;
  const svg = withQr
    ? await QRCode.toString(target, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0B1220", light: "#FFFFFF" } })
    : "";

  return (
    <div
      className={`desktop-hint mt-2 items-center gap-4 rounded-2xl p-3 text-[15px] leading-snug ${
        dark ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-surface text-navy"
      }`}
    >
      {withQr ? (
        <div className="qr size-24 shrink-0 overflow-hidden rounded-xl bg-white p-1" role="img" aria-label={`Código QR que abre ${target}`} dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <Smartphone className="size-6 shrink-0" aria-hidden="true" />
      )}
      <p>
        <strong>Puntivo funciona en celulares Android.</strong> Descárgala desde tu celular{withQr ? " o escanea este QR" : ""}.
      </p>
    </div>
  );
}
