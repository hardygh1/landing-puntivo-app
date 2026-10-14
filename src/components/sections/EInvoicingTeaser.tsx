import { site } from "@/config/site";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";

// Bloque opcional. Solo existe en el HTML si site.features.showEInvoicingTeaser === true.
// Nunca afirmar que ya está disponible.
export function EInvoicingTeaser() {
  if (!site.features.showEInvoicingTeaser) return null;
  return (
    <section id="proximamente" aria-labelledby="proximamente-titulo" className="bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 text-center shadow-soft md:p-10">
        <p className="inline-block rounded-full bg-amber px-4 py-1 text-sm font-extrabold tracking-wide text-navy uppercase">Próximamente</p>
        <h2 id="proximamente-titulo" className="mt-4 font-display text-3xl leading-tight font-black md:text-4xl">
          Próximamente: boletas y facturas electrónicas
        </h2>
        <p className="mt-4 text-ink-soft">
          Estamos trabajando para que puedas emitir comprobantes electrónicos desde Puntivo. Escríbenos si te interesa y te avisamos cuando esté listo.
        </p>
        <WhatsAppButton intent="consulta" label="Avísame cuando esté listo" location="proximamente" className="mt-6" />
      </div>
    </section>
  );
}
