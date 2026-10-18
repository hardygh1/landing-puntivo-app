import { site } from "@/config/site";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VideoSection } from "@/components/sections/VideoSection";
import { ForWho } from "@/components/sections/ForWho";
import { EInvoicingTeaser } from "@/components/sections/EInvoicingTeaser";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { StickyCtaBar } from "@/components/cta/StickyCtaBar";
import { WhatsAppFloat } from "@/components/cta/WhatsAppFloat";
import { DownloadToast } from "@/components/cta/DownloadToast";
import { ClientEffects } from "@/components/ClientEffects";

// TODO cliente: cuando haya testimonios REALES, crear una sección de prueba social aquí.
// No inventar reseñas, estrellas ni cifras.

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-accent px-5 py-3 font-bold text-navy focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        {site.features.showVideo && <VideoSection />}
        <ForWho />
        <EInvoicingTeaser />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCtaBar />
      <WhatsAppFloat />
      <DownloadToast />
      <ClientEffects />
    </>
  );
}
