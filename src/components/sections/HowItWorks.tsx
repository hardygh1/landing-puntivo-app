import { site } from "@/config/site";
import { Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { DownloadDemoButton } from "@/components/cta/DownloadDemoButton";
import { WhatsAppButton } from "@/components/cta/WhatsAppButton";
import { InstallGuide } from "@/components/cta/InstallGuide";

export function HowItWorks() {
  const days = site.demoApk.trialDays;
  const steps = [
    {
      title: "Descarga la demo",
      text: "Viene con productos de ejemplo para que pruebes sin cargar nada.",
      cta: <DownloadDemoButton location="como-funciona" dark={false} />,
    },
    {
      title: `Pruébala ${days} días`,
      text: "Úsala como si fuera tu negocio.",
    },
    {
      title: "Escríbenos y actívala",
      text: (
        <>
          Te enviamos tu clave por WhatsApp. <strong className="text-navy">No pierdes nada de lo que registraste.</strong>
        </>
      ),
      cta: <WhatsAppButton intent="activar" label="Activar mi app" location="como-funciona" />,
    },
  ];

  return (
    <Section id="como-funciona" className="bg-white">
      <div className="text-center">
        <SectionTitle id="como-funciona-titulo">Empieza hoy en 3 pasos</SectionTitle>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-soft">Pruébala gratis en tu propio celular.</p>
      </div>

      <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
        {/* Línea conectora */}
        <span aria-hidden="true" className="absolute top-8 bottom-8 left-8 w-1 rounded-full bg-brand/15 md:top-8 md:right-[16%] md:bottom-auto md:left-[16%] md:h-1 md:w-auto" />
        {steps.map((s, i) => (
          <Reveal as="li" key={i} className="relative grid grid-cols-[4rem_1fr] gap-x-5 md:flex md:flex-col md:items-center md:text-center">
            <span
              aria-hidden="true"
              className="relative z-10 inline-flex size-16 shrink-0 items-center justify-center rounded-full bg-brand font-display text-3xl font-black text-white ring-8 ring-white"
            >
              {i + 1}
            </span>
            <div className="flex flex-1 flex-col md:items-center">
              <h3 className="font-display text-2xl font-black">
                <span className="sr-only">Paso {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </div>
            {s.cta && <div className="relative z-10 col-span-2 mt-5 w-full md:flex md:justify-center">{s.cta}</div>}
          </Reveal>
        ))}
      </ol>

      <InstallGuide />
    </Section>
  );
}
