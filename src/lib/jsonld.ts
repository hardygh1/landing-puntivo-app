import { site } from "@/config/site";
import { faq } from "@/content/faq";
import { featureList } from "@/content/copy";
import { absoluteUrl } from "@/lib/links";

// Datos estructurados (@graph) generados desde la configuración.
export function buildJsonLd() {
  const url = site.siteUrl;
  const orgId = `${url}/#organization`;
  const sameAs = Object.values(site.social).filter(Boolean);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      url,
      logo: absoluteUrl("/brand/puntivo-logo-512.png"),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${site.whatsapp.number.slice(0, 2)}-${site.whatsapp.number.slice(2, 5)}-${site.whatsapp.number.slice(5, 8)}-${site.whatsapp.number.slice(8)}`,
        contactType: "sales",
        areaServed: "PE",
        availableLanguage: "es",
      },
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      name: site.name,
      url,
      inLanguage: site.lang,
      publisher: { "@id": orgId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${url}/#app`,
      name: site.name,
      operatingSystem: "Android",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Punto de venta",
      description: site.description,
      inLanguage: site.lang,
      softwareVersion: site.demoApk.version,
      downloadUrl: absoluteUrl(site.demoApk.url),
      installUrl: absoluteUrl(site.demoApk.url),
      fileSize: site.demoApk.sizeLabel.replace("≈", "").trim(),
      featureList,
      screenshot: ["venta", "qr-yape", "inventario", "etiquetas-seleccion"].map((n) => absoluteUrl(`/img/pantalla-${n}-720.webp`)),
      countriesSupported: "PE",
      publisher: { "@id": orgId },
      // TODO cliente: completar precio en PEN y descomentar. Sin precio real NO se publica "offers"
      // (ni aggregateRating/review: no hay reseñas reales).
      // offers: { "@type": "Offer", price: "XX.XX", priceCurrency: "PEN", availability: "https://schema.org/InStock" },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  if (site.localBusiness) {
    const lb = site.localBusiness;
    graph.push({
      "@type": "LocalBusiness",
      "@id": `${url}/#localbusiness`,
      name: lb.name,
      url,
      telephone: lb.telephone,
      image: absoluteUrl("/brand/puntivo-logo-512.png"),
      address: { "@type": "PostalAddress", ...lb.address },
      ...(lb.geo ? { geo: { "@type": "GeoCoordinates", ...lb.geo } } : {}),
      ...(lb.openingHours ? { openingHours: lb.openingHours } : {}),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Serializa para <script type="application/ld+json"> evitando cerrar la etiqueta. */
export function jsonLdString() {
  return JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");
}
