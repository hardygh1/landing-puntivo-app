import { faq } from "@/content/faq";
import { Section, SectionTitle } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { FaqItem } from "./FaqItem";

export function Faq() {
  return (
    <Section id="preguntas" className="bg-surface">
      <div className="mx-auto max-w-3xl">
        <SectionTitle id="preguntas-titulo" className="text-center">
          Preguntas frecuentes
        </SectionTitle>

        <div className="mt-10 space-y-3">
          {faq.map((item, i) => (
            <FaqItem key={item.q} index={i} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-soft">
          <p className="font-display text-2xl font-black">¿Tienes otra pregunta?</p>
          <WhatsAppButton intent="consulta" label="Pregúntanos por WhatsApp" location="faq" />
        </div>
      </div>
    </Section>
  );
}
