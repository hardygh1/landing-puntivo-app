import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Montserrat } from "next/font/google";
import { site } from "@/config/site";
import { jsonLdString } from "@/lib/jsonld";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["900"], display: "swap", variable: "--font-montserrat" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["700"], display: "swap", variable: "--font-caveat", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: "App de ventas para bodega en tu celular | Puntivo POS",
  description: site.description,
  keywords: [
    "app de ventas para bodega",
    "sistema de ventas para bodega",
    "punto de venta para celular",
    "control de inventario para minimarket",
    "app para registrar ventas",
    "programa de ventas sin internet",
    "app para fiado",
    "cobrar con Yape",
    "etiquetas código de barras",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: "Puntivo POS: convierte tu celular en un punto de venta",
    description: "Vende escaneando, cobra con Yape y Plin, controla stock y fiado. Funciona sin internet. Prueba gratis 3 días.",
    images: [{ url: "/og/puntivo-og.png", width: 1200, height: 630, alt: "Puntivo POS, app de ventas para bodegas en Perú" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puntivo POS: tu celular es tu punto de venta",
    description: "Vende, cobra con Yape y Plin y controla tu bodega sin internet.",
    images: ["/og/puntivo-og.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#2B3BFF", width: "device-width", initialScale: 1 };

// Se ejecuta antes de pintar: activa animaciones (clase js), detecta Android para el aviso
// de escritorio y aplica la variante A/B del H1 (?v=a|b|c, recordada en la sesión).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!/Android/i.test(navigator.userAgent))d.classList.add('not-android');var v=new URLSearchParams(location.search).get('v');if(v){v=v.toLowerCase();if(/^[abc]$/.test(v)){sessionStorage.setItem('puntivo_hv',v);}}else{v=sessionStorage.getItem('puntivo_hv');}if(v&&/^[abc]$/.test(v))d.setAttribute('data-hv',v);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang} data-hv={site.heroVariant} className={`${montserrat.variable} ${inter.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString() }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
