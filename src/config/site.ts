// ÚNICA fuente de configuración editable del sitio.
// Número de WhatsApp, mensajes, APK, versión y flags viven solo aquí.

const demoApkRestauranteUrl = ""; // vacío = no se muestra el botón de la demo de restaurante

export type HeroVariant = "a" | "b" | "c";

export type LocalBusinessData = {
  name: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string; // p. ej. "Lima"
    addressRegion?: string;
    postalCode?: string;
    addressCountry: "PE";
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: string[]; // p. ej. ["Mo-Sa 09:00-19:00"]
};

export const site = {
  name: "Puntivo POS",
  shortName: "Puntivo",
  siteUrl: "https://puntivo.pe", // ⚠️ COMPLETAR: dominio final, sin "/" al final
  locale: "es_PE",
  lang: "es-PE",
  tagline: "Convierte tu celular en un punto de venta",
  description:
    "App de ventas e inventario para bodegas y minimarkets en Perú. Escanea, cobra con Yape y Plin, controla stock y fiado. Funciona sin internet. Prueba 3 días",

  // Variante del H1 por defecto (A/B). También se puede forzar con ?v=b o ?v=c en la URL.
  heroVariant: "a" as HeroVariant,

  whatsapp: {
    number: "51933227824", // sin "+", sin espacios (formato wa.me)
    display: "+51 933 227 824",
    messages: {
      compra: "Hola, quiero la app Puntivo POS para mi negocio.",
      demoAyuda: "Hola, descargué la demo de Puntivo POS y necesito ayuda para instalarla.",
      activar: "Hola, ya probé la demo de Puntivo POS y quiero activarla.",
      restaurante: "Hola, tengo un restaurante y quiero saber más de Puntivo POS.",
      consulta: "Hola, tengo una consulta sobre Puntivo POS.",
    },
  },

  demoApk: {
    url: "/descargas/Puntivo-demo.apk", // ⚠️ COMPLETAR: ruta local (public/descargas/) o URL externa (GitHub Releases, R2…)
    fileName: "Puntivo-demo.apk",
    sizeLabel: "≈ 83 MB", // ⚠️ COMPLETAR si cambias el APK
    version: "0.3.0",
    trialDays: 3,
  },

  demoApkRestaurante: {
    url: demoApkRestauranteUrl,
    fileName: "Puntivo-demo-restaurante.apk",
    sizeLabel: "≈ 230 MB",
  },

  social: {
    tiktok: "", // ⚠️ COMPLETAR (opcional)
    instagram: "",
    facebook: "",
  },

  features: {
    showEInvoicingTeaser: false, // "Próximamente: boletas y facturas electrónicas" — desactivado por defecto
    showRestaurantDemo: demoApkRestauranteUrl.trim() !== "", // se calcula solo
    showVideo: true,
  },

  // Datos para el bloque JSON-LD LocalBusiness. null = no se publica.
  // Ejemplo:
  // localBusiness: {
  //   name: "Puntivo POS",
  //   telephone: "+51-933-227-824",
  //   address: { streetAddress: "Av. …", addressLocality: "Lima", addressCountry: "PE" },
  //   geo: { latitude: -12.0464, longitude: -77.0428 },
  //   openingHours: ["Mo-Sa 09:00-19:00"],
  // },
  localBusiness: null as LocalBusinessData | null,

  analytics: {
    // Se leen de variables de entorno; si están vacías, no se carga nada.
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    vercel: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1",
  },
} as const;
